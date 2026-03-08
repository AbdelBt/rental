import express from "express";
import multer from "multer";
import { supabaseAdmin } from "../supabase.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

// POST /api/customers/register
router.post(
  "/register",
  upload.fields([
    { name: "license", maxCount: 1 },
    { name: "id_front", maxCount: 1 },
    { name: "id_back", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { first_name, last_name, email, phone, password } = req.body;
      if (!first_name || !last_name || !email || !password) {
        return res.status(400).json({ error: "Champs obligatoires manquants." });
      }

      // 1) Créer l'utilisateur auth Supabase pour le client
      const { data: userData, error: userError } =
        await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: false,
        });

      if (userError) throw userError;
      const authUserId = userData.user.id;

      // 2) Créer l'entrée customer
      const { data: customer, error: custError } = await supabaseAdmin
        .from("customers")
        .insert({
          auth_user_id: authUserId,
          first_name,
          last_name,
          email,
          phone,
        })
        .select()
        .single();

      if (custError) throw custError;

      const files = req.files || {};
      const bucket = "kyc"; // à créer dans Supabase Storage
      const uploadedDocs = [];

      const uploadOne = async (field, docType) => {
        const fileArr = files[field];
        if (!fileArr || !fileArr[0]) return;
        const file = fileArr[0];
        const ext = (file.originalname.split(".").pop() || "bin").toLowerCase();
        const path = `${customer.id}/${docType}.${ext}`;
        const { error: upError } = await supabaseAdmin.storage
          .from(bucket)
          .upload(path, file.buffer, {
            contentType: file.mimetype,
            upsert: true,
          });
        if (upError) throw upError;
        const { data: publicUrl } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
        uploadedDocs.push({ doc_type: docType, url: publicUrl.publicUrl });
      };

      await uploadOne("license", "license");
      await uploadOne("id_front", "id_front");
      await uploadOne("id_back", "id_back");

      if (uploadedDocs.length) {
        const payload = uploadedDocs.map((d) => ({
          customer_id: customer.id,
          doc_type: d.doc_type,
          url: d.url,
        }));
        const { error: docsError } = await supabaseAdmin.from("customer_documents").insert(payload);
        if (docsError) throw docsError;
      }

      res.status(201).json({ customerId: customer.id });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      res.status(500).json({ error: "Erreur lors de la création du compte client." });
    }
  },
);

export default router;

