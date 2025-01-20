import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Calendar, MapPin, Cake, UtensilsCrossed, ArrowLeft, Download } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { DatePicker } from './components/DatePicker';
import { FoodGrid } from './components/FoodGrid';
import { PlacePicker } from './components/PlacePicker';
import useConfetti from './hooks/useConfetti';
import { generateDatePDF } from './lib/generatePDF';
import toast from 'react-hot-toast';

const cuisines = [
  { id: 'italian', name: 'Italian', image: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?auto=format&fit=crop&q=80&w=500' },
  { id: 'chinese', name: 'Chinese', image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=500' },
  { id: 'indian', name: 'Indian', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&q=80&w=500' },
  { id: 'mexican', name: 'Mexican', image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?auto=format&fit=crop&q=80&w=500' },
  { id: 'thai', name: 'Thai', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&q=80&w=500' },
  { id: 'japanese', name: 'Japanese', image: 'https://images.unsplash.com/photo-1580822184713-fc5400e7fe10?auto=format&fit=crop&q=80&w=500' }
];

const desserts = [
  { id: 'cake', name: 'Cake', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=500' },
  { id: 'icecream', name: 'Ice Cream', image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=500' },
  { id: 'pastries', name: 'Pastries', image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&q=80&w=500' },
  { id: 'cookies', name: 'Cookies', image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=500' }
];

type Step = 'intro' | 'date' | 'cuisine' | 'dessert' | 'places' | 'location' | 'end';

function App() {
  const [step, setStep] = useState<Step>('intro');
  const [formData, setFormData] = useState({
    receiverName: '',
    date: undefined as Date | undefined,
    cuisine: '',
    dessert: '',
    additionalPlaces: '',
    selectedPlace: null as google.maps.places.PlaceResult | null
  });

  const { triggerConfetti } = useConfetti();

  const handleGeneratePDF = () => {
    try {
      if (!formData.date || !formData.selectedPlace) {
        toast.error('Missing required information');
        return;
      }

      const pdfDataUrl = generateDatePDF({
        ...formData,
        date: formData.date,
        selectedPlace: formData.selectedPlace as google.maps.places.PlaceResult
      });
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = pdfDataUrl;
      link.download = `date-plan-for-${formData.receiverName.toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setStep('end');
      triggerConfetti();
    } catch (error) {
      toast.error('Failed to generate PDF. Please try again.');
    }
  };

  const goBack = () => {
    const steps: Step[] = ['intro', 'date', 'cuisine', 'dessert', 'places', 'location'];
    const currentIndex = steps.indexOf(step);
    if (currentIndex > 0) {
      setStep(steps[currentIndex - 1]);
    }
  };

  // Define the page transition animation
  const pageTransition = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 }
  };

  const renderStep = () => {
    switch (step) {
      case 'intro':
        return (
          <motion.div
            {...pageTransition}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-pink-600 mb-2">Date Planner</h1>
              <p className="text-gray-600">Let's plan something special!</p>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="receiverName">Your Sweet Name</Label>
                <Input
                  id="receiverName"
                  value={formData.receiverName}
                  onChange={(e) => setFormData({ ...formData, receiverName: e.target.value })}
                  placeholder="Enter your sweet name"
                  className="border-pink-200 focus:border-pink-500"
                />
              </div>
            </div>
            <Button
              onClick={() => setStep('date')}
              disabled={!formData.receiverName}
              className="w-full bg-pink-500 hover:bg-pink-600"
            >
              Next <Heart className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        );

      case 'date':
        return (
          <motion.div
            {...pageTransition}
            className="space-y-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-pink-600">Pick a Date & Time</h2>
              <p className="text-gray-600 mt-2">When would you like to go on a date?</p>
            </div>
            <DatePicker
              date={formData.date}
              onSelect={(date) => setFormData({ ...formData, date })}
            />
            <div className="flex gap-4">
              <Button
                onClick={goBack}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setStep('cuisine')}
                disabled={!formData.date}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                Next <Calendar className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );

      case 'cuisine':
        return (
          <motion.div
            {...pageTransition}
            className="space-y-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-pink-600">Pick Your Cuisine</h2>
              <p className="text-gray-600 mt-2">What kind of food would you like to eat?</p>
            </div>
            <FoodGrid
              options={cuisines}
              selected={formData.cuisine}
              onSelect={(cuisine) => setFormData({ ...formData, cuisine: cuisine.id })}
            />
            <div className="flex gap-4">
              <Button
                onClick={goBack}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setStep('dessert')}
                disabled={!formData.cuisine}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                Next <UtensilsCrossed className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );

      case 'dessert':
        return (
          <motion.div
            {...pageTransition}
            className="space-y-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-pink-600">Choose a Dessert</h2>
              <p className="text-gray-600 mt-2">What would you like for dessert?</p>
            </div>
            <FoodGrid
              options={desserts}
              selected={formData.dessert}
              onSelect={(dessert) => setFormData({ ...formData, dessert: dessert.id })}
            />
            <div className="flex gap-4">
              <Button
                onClick={goBack}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setStep('places')}
                disabled={!formData.dessert}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                Next <Cake className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );

      case 'places':
        return (
          <motion.div
            {...pageTransition}
            className="space-y-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-pink-600">What do you wann do next?</h2>
              <p className="text-gray-600 mt-2">Any other places or things you'd like to visit and do?</p>
            </div>
            <textarea
              value={formData.additionalPlaces}
              onChange={(e) => setFormData({ ...formData, additionalPlaces: e.target.value })}
              className="w-full p-4 h-32 rounded-lg border border-pink-200 focus:border-pink-500 focus:ring-pink-500"
              placeholder="Maybe a beach, park, or anywhere special..."
            />
            <div className="flex gap-4">
              <Button
                onClick={goBack}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={() => setStep('location')}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                Next <MapPin className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );

      case 'location':
        return (
          <motion.div
            {...pageTransition}
            className="space-y-6"
          >
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-pink-600">Pick a Location</h2>
              <p className="text-gray-600 mt-2">Where would you like to meet?</p>
            </div>
            <PlacePicker
              onPlaceSelect={(place) => setFormData({ ...formData, selectedPlace: place })}
            />
            <div className="flex gap-4">
              <Button
                onClick={goBack}
                variant="outline"
                className="flex-1"
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              <Button
                onClick={handleGeneratePDF}
                disabled={!formData.selectedPlace}
                className="flex-1 bg-pink-500 hover:bg-pink-600"
              >
                Download Plan <Download className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        );

      case 'end':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-6"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Heart className="mx-auto text-pink-500 h-24 w-24" />
            </motion.div>
            <h2 className="text-3xl font-bold text-pink-600">
              You're the sweetest thing in my life! 💕
            </h2>
            <p className="text-xl text-gray-600">Can't wait for our date!</p>
            <p className="text-gray-500">
              Your date plan has been downloaded!
            </p>
            <Button
              onClick={handleGeneratePDF}
              className="bg-pink-500 hover:bg-pink-600"
            >
              Download Again <Download className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default App;