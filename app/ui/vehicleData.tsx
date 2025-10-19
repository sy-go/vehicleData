'use client'

import { useState, useEffect } from 'react';
import { VehicleDetails, MotHistory, Defect, MotTest } from '@/app/lib/types';
import { useRouter } from 'next/navigation';

export default function VehicleData() {
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);;
  const [motDetails, setMotDetails] = useState<MotTest[] | null>(null);
  const [motHistory, setMotHistory] = useState<MotHistory | null>(null);
  const [error, setError] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem('registrationNumber', registrationNumber);
  }, [registrationNumber]);

  const clearInput = () => {
    setRegistrationNumber('');
    setVehicleDetails(null);
    setMotDetails(null);
    setMotHistory(null);
    localStorage.removeItem('registrationNumber');
    window.location.replace('/')
  }

  useEffect(() => {
    if (registrationNumber === '' && !vehicleDetails && !motDetails && !motHistory) {
      router.replace('/');
    }
  }, [registrationNumber, vehicleDetails, motDetails, motHistory, router]);

  const addToSuggestions = (reg: string) => {
    const updatedSuggestions: string[] = [reg, ...suggestions.filter(s => s !== reg)].slice(0, 10);
    setSuggestions(updatedSuggestions);
    localStorage.setItem('regSuggestions', JSON.stringify(updatedSuggestions));
  };

  /*
    const removeFromSuggestions = (reg: string) => {
      const updatedSuggestions = suggestions.filter(s => s !== reg);
      setSuggestions(updatedSuggestions);
      localStorage.setItem('regSuggestions', JSON.stringify(updatedSuggestions));
    };
  */

  useEffect(() => {
    const savedReg = localStorage.getItem('registrationNumber');
    if (savedReg) {
      setRegistrationNumber(savedReg);
    }

    const savedSuggestions = JSON.parse(localStorage.getItem('regSuggestions') || '[]');
    setSuggestions(savedSuggestions);
  }, []);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setVehicleDetails(null);
    setMotHistory(null);
    addToSuggestions(registrationNumber);

    try {
      const [vehicleResponse, motResponse] = await Promise.all([
        fetch(`/api/dvla`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ registrationNumber }),
        }),
        fetch(`/api/mot?registration=${registrationNumber}`)
      ]);

      if (!vehicleResponse.ok || !motResponse.ok) {
        throw new Error('Failed to fetch data');
      }

      const vehicleData = await vehicleResponse.json();
      const motData = await motResponse.json();


      setVehicleDetails(vehicleData);
      setMotHistory(motData);
      setMotDetails(motData.motTests);

    } catch (err) {
      setError(`**${err} -INVALID VEHICLE REGISTRATION**`);

      // Clear state and force full reload
      setRegistrationNumber('');
      setVehicleDetails(null);
      setMotDetails(null);
      setMotHistory(null);
      localStorage.removeItem('registrationNumber');

      setTimeout(() => {
        window.location.replace('/');
      }, 2000);
    }
  };

  return (
    <div className=" w-full ">
      <div className="p-2  mt-2 md:mt-2 md:p-2">
        <div className=" mb-4 text-center justify-center">
          <span className="font-bold text-2xl text-blue-50 bg-blue-800 p-2 pl-4 ">Vehicle & MOT</span>
          <span className="font-bold text-2xl text-blue-800 bg-blue-50 p-2 pr-4 ">Lookup</span>
        </div>
        <form onSubmit={handleSubmit} className="text-center mt-8">
          <input
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
            placeholder="enter VRN"
            className="w-3/6 h-16 placeholder:text-sm bg-amber-400 text-2xl text-black   text-center font-extrabold placeholder-gray-500 rounded-md md:text-2xl md:w-48 p-2"
            list="regSuggestions"
          />
          <datalist id="regSuggestions" className='
          m-0 p-0'>
            {suggestions.map((suggestion: string, index: number) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
          <div className='justify-center mt-4'>
            <button type="submit" className="focus:outline-none focus:ring focus:ring-blue-300 w-20 m-2 bg-blue-600 text-white p-2 mr-2 rounded-md hover:">Search</button>
            <button type="button" onClick={clearInput} className="focus:outline-none focus:ring focus:ring-blue-300 w-20 m-2 bg-blue-600 text-white p-2  rounded-md">Clear</button>
          </div>
        </form>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      <div className="  justify-center  md:flex pt-4  lg:pt-8 ">
        <div className="  h-4/5 md:w-2/5 bg-slate-800 border border-slate-500 rounded-md m-2 mb-4  ">
          <h2 className="text-xl font-semibold mb-4 p-2 text-center border-b  border-slate-500">Vehicle details</h2>
          <div className="mb-4 p-2  bg-slate-800   rounded-md">
            {vehicleDetails && motHistory ? (
              <table>
                <tbody>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Make and model:</td>
                    <td className='font-semibold'>{vehicleDetails.make} {motHistory.model}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Year manufactured:</td>
                    <td className='font-semibold'>{vehicleDetails.yearOfManufacture}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm  text-right'>First registered:</td>
                    <td className='font-semibold'>{vehicleDetails.monthOfFirstRegistration}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Colour:</td>
                    <td className='font-semibold'>{vehicleDetails.colour}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Fuel:</td>
                    <td className='font-semibold'>{vehicleDetails.fuelType}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Engine size in ccm:</td>
                    <td className='font-semibold'>{vehicleDetails.engineCapacity}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>CO2 emissions:</td>
                    <td className='font-semibold'>{vehicleDetails.co2Emissions}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>MOT:</td>
                    <td className='font-semibold'> {
                      !vehicleDetails.motStatus ? 'no data' :
                        vehicleDetails.motStatus === 'Valid' ? 'valid' : 'not valid'}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Road tax status:</td>
                    <td className='font-semibold'>{vehicleDetails.taxStatus}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Road tax renewal date:</td>
                    <td className='font-semibold'>{
                      !vehicleDetails.taxDueDate ? 'no data'
                        : new Date(vehicleDetails.taxDueDate).toLocaleDateString('en-GB')}</td>
                  </tr>

                  <tr>
                    <td className='pr-2 text-sm text-right'>Last V5 issued on:</td>
                    <td className='font-semibold'>{new Date(vehicleDetails.dateOfLastV5CIssued).toLocaleDateString('en-GB')}, type: {vehicleDetails.typeApproval}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Wheelplan:</td>
                    <td className='font-semibold'>{vehicleDetails.wheelplan}</td>
                  </tr>
                  <tr>
                    <td className='pr-2 text-sm text-right'>Export:</td>
                    <td className='font-semibold'>{vehicleDetails.markedForExport ? 'yes' : 'no'}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <div className=" space-y-4">
                <div >Make and model:<p className="h-6 bg-sky-900  rounded w-3/4 animate-pulse text-sm pl-4" ></p></div>
                <div >Year manufactured:<p className="h-6 bg-sky-900 rounded w-1/2 animate-pulse pl-4"></p></div>
                <div >First registered: <p className="h-6 bg-sky-900 rounded w-5/6 animate-pulse pl-4"></p></div>
                <div >MOT:<p className="h-6 bg-sky-900 rounded w-2/3 animate-pulse"></p></div>
                <div >MOT Expires at:<p className="h-4 bg-sky-900 rounded w-3/4 animate-pulse"></p></div>
                <div >Road tax status:<p className="h-4 bg-sky-900 rounded w-1/2 animate-pulse"></p></div>
                <div >Road tax renewal date:<p className="h-4 bg-sky-900 rounded w-5/6 animate-pulse"></p></div>
                <div >Colour:<p className="h-4 bg-sky-900 rounded w-1/4 animate-pulse  "></p></div>
              </div>
            )}
          </div>
        </div>
        <div className=" md:w-2/5  bg-slate-800 border border-slate-500  rounded-md m-2 mb-4 ">
          <h2 className="text-xl font-semibold mb-4 p-2 text-center border-b border-slate-500">MOT History</h2>
          <ul className=" mb-4  ">
            {motDetails ? (
              motDetails.map((test: MotTest, index: number) => (
                <li key={index} className="mb-4 p-4   bg-slate-800  border-b last:border-b-0 last:rounded-md">
                  <span className='text-sm'>Test date: </span>
                  <span className="font-semibold">
                  {new Date(test.completedDate).toLocaleDateString('en-GB')}</span>
                  

                  <p className='text-sm'>Mileage: <span className='font-semibold'>{test.odometerValue}</span></p>
                  <p className='text-sm'>Result: <span className={test.testResult === 'PASSED' ? 'text-green-300 font-extrabold' : 'text-red-400 font-extrabold'}>
                    {test.testResult}
                  </span></p>
                  <ul className='p-2'>
                    {test.defects && test.defects.map((par: Defect, index: number) => (
                      <li key={index}>
                        <span className='text-sm'>defect type:</span> <span className={par.type === 'ADVISORY' ? 'text-amber-400 font-extrabold' : 'text-rose-400 font-extrabold'}>{par.type}</span>,
                        <p className='ml-8 text-sm'>details: {par.text}</p>
                      </li>
                    ))}
                  </ul>
                </li>
              ))
            ) : (
              [...Array(3)].map((_, index) => (
                <li key={index} className="mb-4 p-2 pb-4 bg-slate-800 last:rounded-md border-b last:border-b-0 ">
                  <div >Test date<p className="h-6 bg-sky-900 rounded w-1/4 mb-2 animate-pulse"></p></div>
                  <div >Result<p className="h-6 bg-sky-900 rounded w-1/4 mb-2 animate-pulse"></p></div>
                  <div >Mileage<p className="h-6 bg-sky-900 rounded w-1/4 mb-2 animate-pulse"></p></div>
                  <div className="space-y-2 mt-4">
                    <div >defect type<p className="h-4 bg-sky-900 rounded w-5/6 animate-pulse"></p></div>
                    <div ><p className="h-4 bg-sky-900 rounded w-5/6 animate-pulse"></p></div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

    </div>
  );
}


