
interface DemoNoticeProps {
  demoMode: boolean;
}

const DemoNotice = ({ demoMode }: DemoNoticeProps) => {
  if (!demoMode) return null;
  
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
      <h3 className="font-medium text-yellow-800">Demo Mode</h3>
      <p className="text-yellow-700 text-sm">
        This is a demonstration of the calculator's results section. In a full account, you'll be able to save these results and access advanced analysis features.
      </p>
    </div>
  );
};

export default DemoNotice;
