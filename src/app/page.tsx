import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/35 backdrop-blur-[2px]" />
        <div className="relative z-10 text-center px-4">
          <h1 className="text-5xl font-bold mb-6 text-white">Welcome to &lt;your gym&gt;</h1>
          <p className="text-xl mb-8 text-gray-200">Transform your body, transform your life</p>
          <div className="space-x-4">
            <Link href="/membership">
              <Button size="lg">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">Why Choose &lt;your gym&gt;?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg glass-effect hover:border-white/10 hover:scale-[1.15] hover:bg-black/40 transition-all duration-300">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-semibold mb-2 text-white">State-of-the-Art Equipment</h3>
              <p className="text-gray-400">Access to the latest fitness equipment and technology</p>
            </div>
            <div className="text-center p-8 rounded-lg glass-effect hover:border-white/10  hover:scale-[1.15] hover:bg-black/40 transition-all duration-300">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Expert Trainers</h3>
              <p className="text-gray-400">Professional guidance from certified fitness experts</p>
            </div>
            <div className="text-center p-8 rounded-lg glass-effect hover:border-white/10  hover:scale-[1.15] hover:bg-black/40 transition-all duration-300">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2 text-white">Flexible Membership</h3>
              <p className="text-gray-400">Choose the membership plan that fits your needs</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Start Your Fitness Journey?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Join &lt;your gym&gt; today and take the first step towards a healthier lifestyle
          </p>
          <Link href="/membership">
            <Button size="lg">
              Join Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
