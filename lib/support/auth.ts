import { auth } from "@/lib/auth";
import { hasPermission, type SupportPermission } from "./permissions";
import { db } from "@/lib/db";

export type SupportActor = {
  id: string;
  role: string;
  name: string;
  email: string;
  username: string;
};

export async function getSupportActor(): Promise<SupportActor | null> {
  try {
    const session = await auth();
    if (!session?.user) return null;

    const user = session.user as any;
    const id = user.id || user.sub || user.email;
    if (!id) return null;

    let role = user.role || "USER";
    if (user.email) {
      try {
        const dbUser = await db.user.findFirst({
          where: { email: user.email.toLowerCase().trim() },
          select: { role: true, id: true, name: true, username: true },
        });
        if (dbUser?.role) {
          role = dbUser.role;
        }
      } catch {}
    }

    // Founder check (strictly verified official email or root ID only)
    const cleanEmail = String(user.email || "").toLowerCase().trim();
    const cleanUsername = String(user.username || "").toLowerCase().trim();
    const cleanId = String(id || user.id || "").toLowerCase().trim();
    if (
      cleanEmail === "founder@zenvitra.xyz" ||
      cleanEmail === "founder@zenvitra.org" ||
      cleanEmail === "yuveer@zenvitra.xyz" ||
      cleanId === "zen_founder_root"
    ) {
      role = "FOUNDER";
    } else if (
      cleanEmail === "aarush@zenvitra.xyz" ||
      cleanEmail === "khushi@zenvitra.xyz" ||
      cleanId === "zen_cofounder_aarush" ||
      cleanId === "zen_cofounder_khushi"
    ) {
      role = "CO_FOUNDER";
    }

    return {
      id: String(id),
      role: String(role).toUpperCase(),
      name: user.name || user.username || "Zenvitra Member",
      email: cleanEmail,
      username: cleanUsername,
    };
  } catch (err) {
    console.error("[GET_SUPPORT_ACTOR_ERROR]", err);
    return null;
  }
}

export async function requireSupportPermission(permission: SupportPermission) {
  const actor = await getSupportActor();

  if (!actor) {
    return { actor: null, error: "UNAUTHENTICATED" as const };
  }

  if (!hasPermission(actor.role, permission)) {
    return { actor: null, error: "FORBIDDEN" as const };
  }

  return { actor, error: null };
}
