
import VehicleData from '@/app/ui/vehicleData';


export default function Home() {
  return (
    <div className="bg-slate-800 text-gray-50 min-h-screen h-full flex flex-col">
      <main className="flex-grow flex flex-col items-center sm:items-start">
        
          <VehicleData />
                 
      </main>
      <footer className="mt-auto w-full">
        <p className="text-center py-2 text-sm" >&copy; Created and maintained by
          <a  href="mailto:gozky@example.com" 
          className='text-blue-500 hover:underline'> @gozky</a></p>
      </footer>
    </div>
  );
}
