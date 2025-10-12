import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star, Package, Truck, Shield } from "lucide-react";

export default function Shop() {
  return (
    <div className="flex flex-col min-h-screen pb-20">
      <div className="flex-1 px-4 py-6 space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Water Testing Kits</h2>
          <p className="text-muted-foreground">Professional-grade testing solutions for your home</p>
        </div>

        {/* Main Product */}
        <Card className="overflow-hidden">
          <div className="h-48 bg-gradient-primary flex items-center justify-center">
            <Package className="w-24 h-24 text-white" />
          </div>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle>Hydrosure 16-Parameter Test Kit</CardTitle>
                <CardDescription>Complete water analysis solution</CardDescription>
              </div>
              <Badge className="bg-accent">Bestseller</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="text-sm text-muted-foreground ml-2">(2,847 reviews)</span>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">What's Included:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ 50 test strips for 16 parameters</li>
                <li>✓ Color comparison chart</li>
                <li>✓ Detailed instruction manual</li>
                <li>✓ Storage container</li>
                <li>✓ Free mobile app analysis</li>
              </ul>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Tests for:</h4>
              <div className="flex flex-wrap gap-2">
                {["pH", "Hardness", "Iron", "Copper", "Lead", "Chlorine", "Nitrate", "Fluoride"].map((param) => (
                  <Badge key={param} variant="secondary">{param}</Badge>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-accent" />
                <span>Free delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-accent" />
                <span>1-year warranty</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <div className="flex items-baseline gap-2 w-full">
              <span className="text-3xl font-bold">₹899</span>
              <span className="text-lg text-muted-foreground line-through">₹1,299</span>
              <Badge variant="destructive" className="ml-auto">31% OFF</Badge>
            </div>
            <Button className="w-full h-12 text-base bg-gradient-primary" size="lg">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Add to Cart
            </Button>
          </CardFooter>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4">
          <Card className="p-4 text-center">
            <Package className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="text-xs font-medium">Easy to Use</p>
          </Card>
          <Card className="p-4 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="text-xs font-medium">Certified</p>
          </Card>
          <Card className="p-4 text-center">
            <Truck className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="text-xs font-medium">Fast Delivery</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
