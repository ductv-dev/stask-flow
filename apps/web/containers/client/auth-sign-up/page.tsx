import { signUpAction } from "@/actions/auth";
import { SignUpForm } from "@workspace/ui/components/sign-up-form";

type Props = {};

export const AuthSignUp: React.FC<Props> = () => {
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignUpForm action={signUpAction} />
      </div>
    </div>
  );
};
