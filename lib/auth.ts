import NextAuth from "next-auth"
import Facebook from "next-auth/providers/facebook"
import { SupabaseAdapter } from "@auth/supabase-adapter"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...(supabaseUrl && supabaseServiceKey
    ? { adapter: SupabaseAdapter({ url: supabaseUrl, secret: supabaseServiceKey }) }
    : {}),
  providers: [
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID!,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET!,
      authorization: {
        params: {
          scope: "email,public_profile,ads_read,ads_management,leads_retrieval",
        },
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.facebookUserId = account.providerAccountId
      }
      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.facebookUserId = token.facebookUserId as string
      return session
    },
  },
})
