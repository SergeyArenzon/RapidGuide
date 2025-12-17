import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';

const auth = betterAuth({
  plugins: [jwt()],
});

export default auth as ReturnType<typeof betterAuth>;
