
import { Switch } from "@/components/ui/switch";

interface BillingToggleProps {
  annual: boolean;
  onChange: (value: boolean) => void;
}

const BillingToggle = ({ annual, onChange }: BillingToggleProps) => {
  return (
    <div className="flex items-center justify-center gap-3 mb-12">
      <span className={`text-sm font-medium ${annual ? 'text-foreground' : 'text-foreground/60'}`}>
        Annual
      </span>
      <Switch
        checked={!annual}
        onCheckedChange={() => onChange(!annual)}
        aria-label="Toggle billing cycle"
      />
      <span className={`text-sm font-medium ${!annual ? 'text-foreground' : 'text-foreground/60'}`}>
        Monthly
      </span>
      {annual && (
        <span className="ml-2 inline-block bg-carbon-100 text-carbon-800 text-xs font-medium py-1 px-2 rounded-full">
          Save 20%
        </span>
      )}
    </div>
  );
};

export default BillingToggle;
