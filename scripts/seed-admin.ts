// scripts/seed-admin.ts
import { config } from 'dotenv';
import { resolve } from 'path';
import bcrypt from 'bcryptjs';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Definir schema directamente (evita problemas de rutas)
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name'),
  created_at: timestamp('created_at').defaultNow(),
});

// Cargar variables de entorno
config({ path: resolve(process.cwd(), '.env.local') });

// Verificar variables
if (!process.env.DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL no encontrada en .env.local');
  console.error('Verifica que el archivo .env.local existe y contiene DATABASE_URL');
  process.exit(1);
}

async function createAdmin() {
  // Conectar a la base de datos
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql);

  const email = 'codezun@gmail.com';
  const password = 'Perr@2026?';
  const name = 'Admin NeuroBity';

  console.log('🔐 Hasheando contraseña...');
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    console.log('📝 Insertando usuario en la base de datos...');
    
    await db.insert(users).values({
      email,
      password: hashedPassword,
      name,
    });

    console.log('\n✅ Usuario admin creado exitosamente!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📧 Email:    ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n⚠️  IMPORTANTE: Cambia esta contraseña después del primer login');
    console.log('🌐 Accede en: http://localhost:3000/admin/login\n');
    
  } catch (error) {
    // Type guard para PostgresError
    const isPostgresError = (err: unknown): err is { code: string; message: string } => {
      return typeof err === 'object' && err !== null && 'code' in err;
    };

    if (isPostgresError(error)) {
      if (error.code === '23505') {
        console.error('\n❌ Error: El usuario ya existe');
        console.error(`   Email: ${email}`);
        console.error('\n💡 Si olvidaste la contraseña, elimina el usuario y vuelve a ejecutar este script\n');
      } else {
        console.error('\n❌ Error de base de datos:', error.message);
      }
    } else if (error instanceof Error) {
      if (error.message.includes('relation "users" does not exist')) {
        console.error('\n❌ Error: La tabla "users" no existe');
        console.error('💡 Ejecuta primero: npm run db:push\n');
      } else {
        console.error('\n❌ Error creando usuario:', error.message);
      }
    } else {
      console.error('\n❌ Error desconocido:', error);
    }
    process.exit(1);
  }

  process.exit(0);
}

console.log('🚀 Iniciando creación de usuario admin...\n');
createAdmin();