import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const { email, password } = credentials;
        if (email === 'admin@example.com' && password === 'admin123') {
          return { id: 1, name: 'Admin', email: 'admin@example.com', role: 'admin' };
        }
        return null;
      }
    })
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/login' }
});

export { handler as GET, handler as POST };
