
interface AuthFormErrorProps {
  error: string | null;
}

const AuthFormError = ({ error }: AuthFormErrorProps) => {
  if (!error) return null;
  
  return (
    <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
      {error}
    </div>
  );
};

export default AuthFormError;
