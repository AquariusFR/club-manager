 import { getSession } from "@/lib/authentication";

 import { NextResponse } from "next/server";

 import fs from "fs";

 import path from "path";

 

 export async function GET() {

  const session = await getSession();

  

  // Security: Only 'Développeur' role can export the system

  if (!session || (session.roleName !== 'Développeur' && session.roleName.toLowerCase() !== 'admin')) {

   return new NextResponse("Unauthorized", { status: 401 });

  }

 

  const dbPath = path.resolve(process.cwd(), "../rcba.db");

 

  if (!fs.existsSync(dbPath)) {

   return new NextResponse("Database file not found", { status: 404 });

  }

 

  const fileBuffer = fs.readFileSync(dbPath);

 

  return new NextResponse(fileBuffer, {

   headers: {

    "Content-Type": "application/x-sqlite3",

    "Content-Disposition": 'attachment; filename="rcba_backup.db"',

   },

  });

 }

 
