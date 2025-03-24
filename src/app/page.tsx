import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-6">Welcome to &lt;your gym&gt; Gym</h1>
          <p className="text-xl mb-8">Transform your body, transform your life</p>
          <div className="space-x-4">
            <Link href="/membership">
              <Button size="lg" className="bg-red-600 hover:bg-red-700">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose &lt;your gym&gt;?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold mb-2">State-of-the-Art Equipment</h3>
              <p className="text-gray-600">Access to the latest fitness equipment and technology</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Expert Trainers</h3>
              <p className="text-gray-600">Professional guidance from certified fitness experts</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Flexible Membership</h3>
              <p className="text-gray-600">Choose the membership plan that fits your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Fitness Journey?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join &lt;your gym&gt; Gym today and take the first step towards a healthier lifestyle
          </p>
          <Link href="/membership">
            <Button size="lg" className="bg-red-600 hover:bg-red-700">
              Join Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
