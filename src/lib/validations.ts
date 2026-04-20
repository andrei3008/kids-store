import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă minim 2 caractere"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug invalid (doar litere mici, cifre, cratime)"),
  description: z.string().optional(),
  price: z.number().positive("Prețul trebuie să fie pozitiv"),
  salePrice: z.number().positive().optional().nullable(),
  images: z.array(z.string()).default([]),
  featured: z.boolean().default(false),
  status: z.enum(["ACTIVE", "DRAFT", "ARCHIVED"]).default("ACTIVE"),
  categoryId: z.string().min(1, "Categoria este obligatorie"),
  sizes: z.array(z.object({
    label: z.string().min(1),
    stock: z.number().int().min(0),
  })).min(1, "Adaugă cel puțin o mărime"),
});

export const categoryCreateSchema = z.object({
  name: z.string().min(2, "Numele trebuie să aibă minim 2 caractere"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
  image: z.string().optional(),
  sortOrder: z.number().int().default(0),
});

export const orderCreateSchema = z.object({
  customerName: z.string().min(2, "Numele este obligatoriu"),
  customerEmail: z.string().email("Email invalid"),
  customerPhone: z.string().min(8, "Telefon invalid"),
  address: z.string().min(5, "Adresa este obligatorie"),
  city: z.string().min(2, "Orașul este obligatoriu"),
  county: z.string().min(2, "Județul este obligatoriu"),
  postalCode: z.string().min(4, "Cod poștal invalid"),
  notes: z.string().optional(),
  items: z.array(z.object({
    productId: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().int().min(1),
    size: z.string(),
  })).min(1, "Coșul este gol"),
});

export const loginSchema = z.object({
  email: z.string().email("Email invalid"),
  password: z.string().min(6, "Parola trebuie să aibă minim 6 caractere"),
});
