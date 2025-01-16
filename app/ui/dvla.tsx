'use client'


import { useState, useEffect } from 'react';

interface VehicleDetails {
  make: string;
  colour: string;
  yearOfManufacture: number;
  monthOfFirstRegistration: string;
  motStatus: string;
  motExpiryDate: string;
  taxStatus: string;
  taxDueDate: string;
  engineCapacity: number;
  fuelType: string;
  co2Emissions: number;
  dateOfLastV5CIssued: string;
  typeApproval: string;
  wheelplan: string;
  markedForExport: boolean;
}

interface MotHistory {
  model: string;
}

interface Defect {
  type: string;
  text: string;
}

interface MotTest {
  completedDate: string;
  testResult: string;
  odometerValue: number;
  defects?: Defect[];
}

export default function VehicleData() {
  const [registrationNumber, setRegistrationNumber] = useState<string>('');
  const [vehicleDetails, setVehicleDetails] = useState<VehicleDetails | null>(null);;
  const [motDetails, setMotDetails] = useState<MotTest[] | null>(null);
  const [motHistory, setMotHistory] = useState<MotHistory | null>(null);
  const [error, setError] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>([]);




  useEffect(() => {
    localStorage.setItem('registrationNumber', registrationNumber);
  }, [registrationNumber]);


  const clearInput = () => {
    setRegistrationNumber('');
    setVehicleDetails(null);
    setMotDetails(null);
    setMotHistory(null);
    localStorage.removeItem('registrationNumber');
  }


  const addToSuggestions = (reg: string) => {
    const updatedSuggestions: string[] = [reg, ...suggestions.filter(s => s !== reg)].slice(0, 5);
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
      setMotDetails(motData.motTests)
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error(err);
    }
  };

  return (
    <div className="container w-full p-2">
      <div className="md:flex  justify-center content-center border p-6">
        <p className=" pr-4 content-center">Vehicle & MOT Information for:</p>
        <form onSubmit={handleSubmit} >
          <input
            type="text"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
            placeholder="Enter registration number"
            className="w-80 p-2 mr-2 bg-amber-400 text-black  hover:border  border-blue-600 text-center font-semibold placeholder-gray-500 rounded-md"
            list="regSuggestions"
          />
          <datalist id="regSuggestions" className='m-l-2'>
            {suggestions.map((suggestion: string, index: number) => (
              <option key={index} value={suggestion} />
            ))}
          </datalist>
          <button type="submit" className=" w-20 bg-blue-500 text-white p-2 mr-2 rounded-md ">Search</button>
          <button type="button" onClick={clearInput} className=" w-20 bg-blue-500 text-white p-2  rounded-md">Clear</button>
        </form>

      </div>

      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-wrap -mx-2 pt-8  ">
        <div className="w-full md:w-1/2 px-2 mb-4 ">
          <h2 className="text-xl font-semibold mb-2 pl-8">Vehicle details</h2>


          { /* vehicleDetails && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(vehicleDetails, null, 2)}
            </pre>
          ) */} {vehicleDetails && (
            <div className='flex border'>
              <ul className='p-2  text-right  '>
                <li className='p-r-1'>Make & Model: </li>
                <li className='p-r-1 '>Colour: </li>
                <li className='p-r-1 '>Year manufactured: </li>
                <li className='p-r-1 '>First registration: </li>
                <li className='p-r-1 '>MOT: </li>
                <li className='p-r-1 '>MOT expires on:</li>
                <li className='p-r-1 '>Road tax status: </li>
                <li className='p-r-1 '>Road Tax renewal due: </li>
                <li className='p-r-1 '>Engine size in CCM: </li>
                <li className='p-r-1 '>Fuel: </li>
                <li className='p-r-1 '>Emisions: </li>
                <li className='p-r-1 '>Last V5 issued on: </li>
                <li className='p-r-1 '>Wheelplan: </li>
                <li className='p-r-1 '>Export: </li>
              </ul>
              {vehicleDetails && motHistory && (
                <ul className='p-2'>
                  <li className='p-r-1'> {vehicleDetails.make} {motHistory.model}</li>
                  <li className='p-r-1'> {vehicleDetails.colour}</li>
                  <li className='p-r-1'>{vehicleDetails.yearOfManufacture}</li>
                  <li className='p-r-1'> {vehicleDetails.monthOfFirstRegistration}</li>
                  <li className='p-r-1'>{vehicleDetails.motStatus === 'Valid' ? 'valid' : 'not valid'}</li>
                  <li className='p-r-1'>{new Date(vehicleDetails.motExpiryDate).toLocaleDateString('en-GB')}</li>
                  <li className='p-r-1'> {vehicleDetails.taxStatus}</li>
                  <li className='p-r-1'>{new Date(vehicleDetails.taxDueDate).toLocaleDateString('en-GB')}</li>
                  <li className='p-r-1'> {vehicleDetails.engineCapacity}</li>
                  <li className='p-r-1'> {vehicleDetails.fuelType}</li>
                  <li className='p-r-1'> {vehicleDetails.co2Emissions}</li>
                  <li className='p-r-1'> {new Date(vehicleDetails.dateOfLastV5CIssued).toLocaleDateString('en-GB')}, type: {vehicleDetails.typeApproval}</li>
                  <li className='p-r-1'> {vehicleDetails.wheelplan}</li>
                  <li className='p-r-1'>{vehicleDetails.markedForExport ? 'yes' : 'no'}</li>
                </ul>
              )}
            </div>


          )}

        </div>
        <div className="w-full md:w-1/2 px-2 mb-4 ">
          <h2 className="text-xl font-semibold mb-2 pl-8">MOT History</h2>
          <ul>
            {motDetails &&
              motDetails.map((test: MotTest, index: number) =>
                <li key={index} className="mb-2 p-2 border">
                  <span className="font-semibold">Test date: </span>
                  {new Date(test.completedDate).toLocaleDateString('en-GB')}
                  <span className="ml-2 font-semibold">Result: </span>
                  <span className={test.testResult === 'PASSED' ? 'text-green-600' : 'text-red-600'}>
                    {test.testResult}
                  </span>
                  <p className='font-semibold'>Mileage: {test.odometerValue}</p>
                  <ul className='p-2'>
                    {test.defects && test.defects.map((par: Defect, index: number) =>
                      <li key={index}>
                        defect type: <span className={par.type === 'ADVISORY' ? 'text-blue-600' : 'text-red-600'}>{par.type}</span>,
                        <p className='ml-2'>details: {par.text}</p>
                      </li>
                    )}
                  </ul>
                </li>
              )
            }
          </ul>

          { /*motHistory && (
            <pre className="bg-gray-100 p-4 rounded overflow-auto">
              {JSON.stringify(motHistory, null, 2)}
            </pre>
          ) */}
        </div>
      </div>
    </div>
  );
}


/*
<div className="w-full md:w-1/2 px-2 mb-4">
  <h2 className="text-xl font-semibold mb-2">MOT History</h2>
  {motHistory && (
    <pre className="bg-gray-100 p-4 rounded overflow-auto">
      {JSON.stringify(motHistory, null, 2)}
    </pre>
  )}
</div>
*/