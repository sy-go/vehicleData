
import VehicleData from '@/app/ui/vehicleData';


export default function Home() {
  return (
    <div className="bg-slate-800 text-gray-50 min-h-screen h-full flex flex-col">
      <main className="flex-grow flex flex-col items-center sm:items-start">

        <VehicleData />

      </main>
      <footer className="mt-auto w-full text-lime-600 text-right">
        <p className="  text-sm mr-4" ><span className='text-xl'>&copy;</span> Created and maintained by
          <span className='text-lime-500 font-bold'> @gozky</span></p>
        <p className='text-sm  mr-16'>mail:
          <a href="mailto:gozky.syl@gmail.com"
            className='text-lime-500 hover:underline font-bold '> gozky.syl@gmail.com</a>
        </p>
      </footer>
    </div>
  );
}
