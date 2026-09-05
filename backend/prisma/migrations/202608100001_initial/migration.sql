-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "admins" (
    "id" UUID NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "name" VARCHAR(120) NOT NULL DEFAULT 'Store Admin',
    "password_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_sessions" (
    "id" UUID NOT NULL,
    "admin_id" UUID NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "login_attempts" (
    "key" VARCHAR(64) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "window_start" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "login_attempts_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" VARCHAR(80) NOT NULL,
    "name_en" VARCHAR(160) NOT NULL,
    "name_ar" VARCHAR(160) NOT NULL,
    "description_en" TEXT NOT NULL DEFAULT '',
    "description_ar" TEXT NOT NULL DEFAULT '',
    "image_url" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" VARCHAR(120) NOT NULL,
    "name_en" VARCHAR(200) NOT NULL,
    "name_ar" VARCHAR(200) NOT NULL,
    "description_en" TEXT NOT NULL DEFAULT '',
    "description_ar" TEXT NOT NULL DEFAULT '',
    "category_id" VARCHAR(80) NOT NULL,
    "brand" VARCHAR(160) NOT NULL,
    "image_url" TEXT NOT NULL,
    "price" DECIMAL(14,2),
    "currency" VARCHAR(8) NOT NULL DEFAULT 'SYP',
    "quantity" INTEGER,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "is_new" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" UUID NOT NULL,
    "product_id" VARCHAR(120) NOT NULL,
    "value" VARCHAR(32) NOT NULL,
    "image_url" TEXT NOT NULL,
    "name_en" VARCHAR(200),
    "name_ar" VARCHAR(200),
    "description_en" TEXT,
    "description_ar" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_content" (
    "id" VARCHAR(40) NOT NULL DEFAULT 'default',
    "eyebrow_en" VARCHAR(200) NOT NULL,
    "eyebrow_ar" VARCHAR(200) NOT NULL,
    "title_start_en" VARCHAR(220) NOT NULL,
    "title_start_ar" VARCHAR(220) NOT NULL,
    "title_accent_en" VARCHAR(220) NOT NULL,
    "title_accent_ar" VARCHAR(220) NOT NULL,
    "title_end_en" VARCHAR(220) NOT NULL,
    "title_end_ar" VARCHAR(220) NOT NULL,
    "body_en" TEXT NOT NULL,
    "body_ar" TEXT NOT NULL,
    "primary_cta_en" VARCHAR(120) NOT NULL,
    "primary_cta_ar" VARCHAR(120) NOT NULL,
    "secondary_cta_en" VARCHAR(120) NOT NULL,
    "secondary_cta_ar" VARCHAR(120) NOT NULL,
    "note_en" VARCHAR(200) NOT NULL,
    "note_ar" VARCHAR(200) NOT NULL,
    "card_label_en" VARCHAR(160) NOT NULL,
    "card_label_ar" VARCHAR(160) NOT NULL,
    "card_title_en" VARCHAR(160) NOT NULL,
    "card_title_ar" VARCHAR(160) NOT NULL,
    "main_image_url" TEXT NOT NULL,
    "detail_image_url" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_content" (
    "id" VARCHAR(40) NOT NULL DEFAULT 'default',
    "eyebrow_en" VARCHAR(200) NOT NULL,
    "eyebrow_ar" VARCHAR(200) NOT NULL,
    "title_en" VARCHAR(260) NOT NULL,
    "title_ar" VARCHAR(260) NOT NULL,
    "body_en" TEXT NOT NULL,
    "body_ar" TEXT NOT NULL,
    "quote_en" TEXT NOT NULL,
    "quote_ar" TEXT NOT NULL,
    "main_image_url" TEXT NOT NULL,
    "secondary_image_url" TEXT NOT NULL,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "highlights" (
    "id" UUID NOT NULL,
    "icon" VARCHAR(32) NOT NULL,
    "title_en" VARCHAR(180) NOT NULL,
    "title_ar" VARCHAR(180) NOT NULL,
    "body_en" TEXT NOT NULL,
    "body_ar" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "highlights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_settings" (
    "id" VARCHAR(40) NOT NULL DEFAULT 'default',
    "section_eyebrow_en" VARCHAR(200) NOT NULL,
    "section_eyebrow_ar" VARCHAR(200) NOT NULL,
    "section_title_en" VARCHAR(260) NOT NULL,
    "section_title_ar" VARCHAR(260) NOT NULL,
    "section_body_en" TEXT NOT NULL,
    "section_body_ar" TEXT NOT NULL,
    "address_en" TEXT NOT NULL,
    "address_ar" TEXT NOT NULL,
    "phone_display" VARCHAR(60) NOT NULL,
    "phone_international" VARCHAR(32) NOT NULL,
    "whatsapp_number" VARCHAR(32) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "maps_url" TEXT NOT NULL,
    "contact_image_url" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "social_links" (
    "id" VARCHAR(40) NOT NULL,
    "url" TEXT NOT NULL DEFAULT '',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "social_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" VARCHAR(40) NOT NULL DEFAULT 'default',
    "store_name_en" VARCHAR(180) NOT NULL,
    "store_name_ar" VARCHAR(180) NOT NULL,
    "footer_title_en" VARCHAR(260) NOT NULL,
    "footer_title_ar" VARCHAR(260) NOT NULL,
    "footer_description_en" TEXT NOT NULL,
    "footer_description_ar" TEXT NOT NULL,
    "logo_url" TEXT NOT NULL DEFAULT '',
    "favicon_url" TEXT NOT NULL DEFAULT '',
    "seo_title_en" VARCHAR(260) NOT NULL,
    "seo_title_ar" VARCHAR(260) NOT NULL,
    "meta_description_en" TEXT NOT NULL,
    "meta_description_ar" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE INDEX "admin_sessions_admin_id_idx" ON "admin_sessions"("admin_id");

-- CreateIndex
CREATE INDEX "admin_sessions_expires_at_idx" ON "admin_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "login_attempts_expires_at_idx" ON "login_attempts"("expires_at");

-- CreateIndex
CREATE INDEX "categories_active_display_order_idx" ON "categories"("active", "display_order");

-- CreateIndex
CREATE INDEX "products_active_display_order_idx" ON "products"("active", "display_order");

-- CreateIndex
CREATE INDEX "products_category_id_active_idx" ON "products"("category_id", "active");

-- CreateIndex
CREATE INDEX "products_featured_active_idx" ON "products"("featured", "active");

-- CreateIndex
CREATE INDEX "product_variants_product_id_display_order_idx" ON "product_variants"("product_id", "display_order");

-- CreateIndex
CREATE INDEX "highlights_active_display_order_idx" ON "highlights"("active", "display_order");

-- CreateIndex
CREATE INDEX "social_links_enabled_display_order_idx" ON "social_links"("enabled", "display_order");

-- AddForeignKey
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
