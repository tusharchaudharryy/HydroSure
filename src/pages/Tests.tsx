import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Image as ImageIcon, MapPin, Clock, ArrowRight, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Tests() {
  const [step, setStep] = useState(1);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="flex-1 px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Water Quality Testing</h2>
          <p className="text-muted-foreground">Get accurate results in 3 simple steps</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-all ${
                step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}>
                {step > s ? <CheckCircle2 className="w-6 h-6" /> : s}
              </div>
              {s < 3 && (
                <div className={`flex-1 h-1 mx-2 rounded transition-all ${
                  step > s ? "bg-primary" : "bg-muted"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Instruction Card */}
        <Card className="overflow-hidden border-2 border-primary/20">
          <CardHeader className="bg-gradient-primary text-primary-foreground">
            <CardTitle>How It Works</CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Follow these steps for accurate results
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 shrink-0">
                  <ImageIcon className="w-6 h-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold">Step 1: Capture Chart Image</h4>
                  <p className="text-sm text-muted-foreground">
                    Take a clear photo of the printed color comparison chart included with your kit
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-accent/10 shrink-0">
                  <Camera className="w-6 h-6 text-accent" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold">Step 2: Capture Test Strip</h4>
                  <p className="text-sm text-muted-foreground">
                    After dipping the test strip in water for 2 seconds, photograph it next to the chart
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-success/10 shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-success" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold">Step 3: Get Results</h4>
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes the colors and generates a detailed report with pH levels and water quality
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <Badge variant="secondary">Tip</Badge>
                <p className="text-muted-foreground">
                  Ensure good lighting and hold the camera steady for best results
                </p>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <Badge variant="secondary">Note</Badge>
                <p className="text-muted-foreground">
                  The app will guide you through each step with visual overlays
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Example Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Example Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                <div className="text-center">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Chart Example</p>
                </div>
              </div>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center border-2 border-dashed">
                <div className="text-center">
                  <Camera className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">Strip Example</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Permissions Notice */}
        <Card className="border-warning/20 bg-warning/5">
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-warning/10 shrink-0">
                <MapPin className="w-5 h-5 text-warning" />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-sm">Permissions Required</h4>
                <p className="text-xs text-muted-foreground">
                  This test requires camera and location access to provide accurate results and save test location
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Start Button */}
        <Button 
          className="w-full h-14 text-base bg-gradient-primary shadow-glow" 
          size="lg"
          onClick={() => setStep(2)}
        >
          <Camera className="w-5 h-5 mr-2" />
          Start Water Test
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Recent Tests */}
        <div className="space-y-3">
          <h3 className="font-semibold">Recent Tests</h3>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="font-medium">pH: 7.2 - Neutral</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  2 days ago
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Report
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
