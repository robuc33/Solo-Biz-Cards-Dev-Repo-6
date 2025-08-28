import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export function ReferralEarningRate() {
  const [childEarnings, setChildEarnings] = useState("");
  const [grandchildEarnings, setGrandchildEarnings] = useState("");
  const [operatingCostRate, setOperatingCostRate] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Referral earning rates have been saved successfully.",
    });
  };

  return (
    <Card className="lg:col-span-2 card-hover">
      <CardHeader>
        <CardTitle className="text-lg">Referral Earning Rate</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm">Child affiliate earnings after monetization</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={childEarnings}
                onChange={(e) => setChildEarnings(e.target.value)}
                className="w-20 h-8 text-xs"
                placeholder="0"
              />
              <span className="text-sm">%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm">Grandchild affiliate earnings after monetization</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={grandchildEarnings}
                onChange={(e) => setGrandchildEarnings(e.target.value)}
                className="w-20 h-8 text-xs"
                placeholder="0"
              />
              <span className="text-sm">%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between border-b pb-2">
            <span className="text-sm">Member's operating cost deduction rate</span>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={operatingCostRate}
                onChange={(e) => setOperatingCostRate(e.target.value)}
                className="w-20 h-8 text-xs"
                placeholder="0"
              />
              <span className="text-sm">%</span>
            </div>
          </div>
          
          <div className="pt-4 border-t border-border mt-4">
            <Button onClick={handleSave} className="w-full">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}