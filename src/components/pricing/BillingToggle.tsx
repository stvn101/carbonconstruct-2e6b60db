
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";

interface BillingToggleProps {
  annual: boolean;
  onChange: (value: boolean) => void;
}

const BillingToggle = ({ annual, onChange }: BillingToggleProps) => {
  const { theme } = useTheme();
  
  return (
    <div className="flex items-center justify-center gap-3 mb-12">
      <span className={`text-sm font-medium ${annual ? 'text-foreground' : 'text-foreground/60'}`}>
        Annual
      </span>
      <Switch
        checked={!annual}
        onCheckedChange={() => onChange(!annual)}
        aria-label="Toggle billing cycle"
        className="data-[state=checked]:bg-carbon-600 data-[state=unchecked]:bg-carbon-400 dark:data-[state=checked]:bg-carbon-500 dark:data-[state=unchecked]:bg-carbon-700"
      />
      <span className={`text-sm font-medium ${!annual ? 'text-foreground' : 'text-foreground/60'}`}>
        Monthly
      </span>
      {annual && (
        <span className="ml-2 inline-block bg-carbon-100 text-black text-xs font-medium py-1 px-2 rounded-full dark:bg-carbon-700 dark:text-carbon-100">
          Save 15%
        </span>
      )}
    </div>
  );
};

export default BillingToggle;
