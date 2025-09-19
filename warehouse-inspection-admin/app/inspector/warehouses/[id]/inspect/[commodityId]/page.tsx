 "use client"

import { useParams } from "next/navigation"
import { useEffect, useMemo } from "react"
import { fetchCommodities } from "@/lib/api"
import type { Commodity } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// export default function InspectionFormPage() {
//   const { id, commodityId } = useParams()
//   const [commodities, setCommodities] = useState<Commodity[]>([])

//   useEffect(() => {
//     fetchCommodities().then(setCommodities).catch(console.error)
//   }, [])

//   const selectedCommodity = useMemo(
//     () => commodities.find(c => c.id.toString() === String(commodityId)),
//     [commodities, commodityId]
//   )

//   const YesNoNA = () => (
//     <Select>
//       <SelectTrigger>
//         <SelectValue placeholder="Select" />
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="yes">Yes</SelectItem>
//         <SelectItem value="no">No</SelectItem>
//         <SelectItem value="na">N/A</SelectItem>
//       </SelectContent>
//     </Select>
//   )

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     alert("✅ Inspection form submitted!")
//   }

//   return (
//     <div className="w-full min-h-screen p-6 space-y-6">
//       <div className="text-2xl font-semibold">Warehouse {id} • Inspect Commodity {commodityId}</div>

//       {selectedCommodity?.Storage === "Cold" ? (
//         <div className="p-6 text-center text-lg font-semibold text-red-600">
//           ❄️ Oops! Currently no form available for cold storage.
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-8">
//           <section className="grid grid-cols-2 gap-4">
//             <div>
//               <Label>Date</Label>
//               <Input type="date" required />
//             </div>
//             <div>
//               <Label>Location</Label>
//               <Input placeholder="WH ID" required />
//             </div>
//             <div>
//               <Label>Warehouse Name</Label>
//               <Input required />
//             </div>
//             <div>
//               <Label>Borrower’s Name & Address</Label>
//               <Textarea required />
//             </div>
//             <div>
//               <Label>Name Of Commodity</Label>
//               <Input defaultValue={selectedCommodity?.Commodity_Name} readOnly />
//             </div>
//             <div>
//               <Label>Quality under pledge</Label>
//               <Input />
//             </div>
//             <div>
//               <Label>Name of CM service</Label>
//               <Input />
//             </div>
//             <div>
//               <Label>W/H or CS Supervisor</Label>
//               <Input />
//             </div>
//             <div>
//               <Label>Audit Name</Label>
//               <Input />
//             </div>
//             <div>
//               <Label>Storage Capacity</Label>
//               <Input />
//             </div>
//           </section>

//           <section>
//             <h2 className="text-lg font-semibold mb-2">Inspection Checklist</h2>
//             <div className="overflow-x-auto">
//               <table className="w-full border text-sm">
//                 <thead className="bg-gray-100">
//                   <tr>
//                     <th className="border p-2">#</th>
//                     <th className="border p-2">Risk</th>
//                     <th className="border p-2">Parameter</th>
//                     <th className="border p-2">Yes/No/NA</th>
//                     <th className="border p-2">Remark</th>
//                     <th className="border p-2">Image</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {[
//                     { id: 1, risk: "High Risk", param: "Nature of agreement – Lease/ Sale Deed/ Other agreements (mention type)" },
//                     { id: 2, risk: "High Risk", param: "Whether agreement is valid and expiry details checked" },
//                     { id: 3, risk: "High Risk", param: "Premises details of facility – validity & expiry terms available in premises and if checked" },
//                     { id: 4, risk: "High Risk", param: "Whether stock & key is with Collateral Manager / Inditrade" },
//                     { id: 5, risk: "High Risk", param: "Whether all doors & windows in condition" },
//                     { id: 6, risk: "High Risk", param: "Any cracks/ damaged portions in structure" },
//                     { id: 7, risk: "High Risk", param: "Any signs of water logging or dampness observed in facility" },
//                     { id: 8, risk: "High Risk", param: "Whether ventilation and exhaust systems available and working" },
//                     { id: 9, risk: "High Risk", param: "Whether electrical fittings & lighting are adequate and available in sufficient number" },
//                     { id: 10, risk: "Medium Risk", param: "Signs of seepage / water leakage from roof, walls, etc." },
//                     { id: 11, risk: "Medium Risk", param: "Signs of any infestation with rodents/ insects/ birds" },
//                     { id: 12, risk: "Medium Risk", param: "Type of construction" },
//                     { id: 13, risk: "Medium Risk", param: "Condition of roof and bearing" },
//                     { id: 14, risk: "Medium Risk", param: "Pucca wall with separate entrance and exit available" },
//                     { id: 15, risk: "Medium Risk", param: "Surrounding area with rainwater draining facility or any water pumping out facility" },
//                     { id: 16, risk: "Medium Risk", param: "Any history of flooding in last two years and damage of cargo due to rain" },
//                     { id: 17, risk: "Medium Risk", param: "License of FSSAI for storage" },
//                     { id: 18, risk: "High Risk", param: "Whether physical stock matches with documented quantity" },
//                     { id: 19, risk: "High Risk", param: "Whether Commodity variety matches with that specified in documents" },
//                     { id: 20, risk: "High Risk", param: "Whether uniform average size of bags present in each stack" },
//                     { id: 21, risk: "Medium Risk", param: "Whether stacks are properly arranged and in countable position" },
//                     { id: 22, risk: "Medium Risk", param: "Whether stack cards and lot cards have been properly placed and updated" },
//                     { id: 23, risk: "Medium Risk", param: "Whether stock hypothecation/pledge card with lender name properly displayed outside warehouse" },
//                     { id: 24, risk: "Medium Risk", param: "Whether stock register is updated and maintained" },
//                     { id: 25, risk: "Medium Risk", param: "Whether copies of WR, DO, RC, SD notes, Gate pass & Weigh bridge slips available at premises" },
//                     { id: 26, risk: "Medium Risk", param: "Whether any different stock found under other bank/NBFC overlapping with our stocks" },
//                     { id: 27, risk: "Medium Risk", param: "Whether any spurious/adulterated commodity observed near our pledged stocks" },
//                     { id: 28, risk: "Medium Risk", param: "Whether any unrecovered/unaccounted stock seen near our stock" },
//                     { id: 29, risk: "Medium Risk", param: "Whether last fumigation record available with last date of it done" },
//                     { id: 30, risk: "Medium Risk", param: "Number of random samples taken and observed" },
//                     { id: 31, risk: "Medium Risk", param: "Whether any infestation/deterioration observed in stock" },
//                     { id: 32, risk: "Low Risk", param: "Name of Warehouse/Cold storage incharge" },
//                     { id: 33, risk: "Low Risk", param: "Is warehouse incharge wearing proper ID?" },
//                     { id: 34, risk: "Low Risk", param: "Does CM services staff visit location daily/weekly/monthly" },
//                     { id: 35, risk: "Low Risk", param: "Last inspection done (by concerned CM staff) with details of date, name & designation of employee" },
//                   ].map((row) => (
//                     <tr key={row.id}>
//                       <td className="border p-2">{row.id}</td>
//                       <td className="border p-2">{row.risk}</td>
//                       <td className="border p-2">{row.param}</td>
//                       <td className="border p-2"><YesNoNA /></td>
//                       <td className="border p-2"><Textarea placeholder="Remark" /></td>
//                       <td className="border p-2"><Input type="file" /></td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </section>

//           <section className="grid grid-cols-2 gap-4">
//             <div>
//               <Label>Inspector Name</Label>
//               <Input required />
//             </div>
//             <div>
//               <Label>Inspector Designation</Label>
//               <Input required />
//             </div>
//             <div>
//               <Label>Inspector Signature</Label>
//               <Input type="file" />
//             </div>
//             <div>
//               <Label>Sign-off Date</Label>
//               <Input type="date" required />
//             </div>
//           </section>

//           <Button type="submit" className="w-full">Submit Inspection</Button>
//         </form>
//       )}
//     </div>
//   )
// }

import { useState } from "react"

const checklistFields = [
  { id: 1, db: "NatureOfAgreement", label: "Nature of agreement – Lease/ Sale Deed/ Other agreements (mention type)" },
  { id: 2, db: "AgreementIsValid", label: "Whether agreement is valid and expiry details checked" },
  { id: 3, db: "PremisesDetails", label: "Premises details of facility – validity & expiry terms available in premises and if checked" },
  { id: 4, db: "StockAndKey", label: "Whether stock & key is with Collateral Manager / Inditrade" },
  { id: 5, db: "DoorsAndWindows", label: "Whether all doors & windows in condition" },
  { id: 6, db: "AnyDamageInStructure", label: "Any cracks/ damaged portions in structure" },
  { id: 7, db: "WaterLogging", label: "Any signs of water logging or dampness observed in facility" },
  { id: 8, db: "VentilationAvailable", label: "Whether ventilation and exhaust systems available and working" },
  { id: 9, db: "ElectricalFittings", label: "Whether electrical fittings & lighting are adequate and available in sufficient number" },
  { id: 10, db: "SignsOfSeepage", label: "Signs of seepage / water leakage from roof, walls, etc." },
  { id: 11, db: "SignsOfInfestation", label: "Signs of any infestation with rodents/ insects/ birds" },
  { id: 12, db: "TypeOfConstruction", label: "Type of construction" },
  { id: 13, db: "ConditionOfRoof", label: "Condition of roof and bearing" },
  { id: 14, db: "PuccaWall", label: "Pucca wall with separate entrance and exit available" },
  { id: 15, db: "SurroundingAreaWithWater", label: "Surrounding area with rainwater draining facility or any water pumping out facility" },
  { id: 16, db: "HistoryOfFlooding", label: "Any history of flooding in last two years and damage of cargo due to rain" },
  { id: 17, db: "LicenseOfFSSAI", label: "License of FSSAI for storage" },
  { id: 18, db: "PhysicalStockMatch", label: "Whether physical stock matches with documented quantity" },
  { id: 19, db: "CommodityVarietyMatch", label: "Whether Commodity variety matches with that specified in documents" },
  { id: 20, db: "AverageSizeOfBagPresent", label: "Whether uniform average size of bags present in each stack" },
  { id: 21, db: "StacksAreProperlyArranged", label: "Whether stacks are properly arranged and in countable position" },
  { id: 22, db: "StackAndLotCards", label: "Whether stack cards and lot cards have been properly placed and updated" },
  { id: 23, db: "LenderNameDIsplayed", label: "Whether stock hypothecation/pledge card with lender name properly displayed outside warehouse" },
  { id: 24, db: "StockRegisterIsUpdated", label: "Whether stock register is updated and maintained" },
  { id: 25, db: "CopiesOfDocsAvailable", label: "Whether copies of WR, DO, RC, SD notes, Gate pass & Weigh bridge slips available at premises" },
  { id: 26, db: "StockFoundOverlapping", label: "Whether any different stock found under other bank/NBFC overlapping with our stocks" },
  { id: 27, db: "AdulteratedCommodity", label: "Whether any spurious/adulterated commodity observed near our pledged stocks" },
  { id: 28, db: "UnrecoveredStock", label: "Whether any unrecovered/unaccounted stock seen near our stock" },
  { id: 29, db: "LastFumigationRecord", label: "Whether last fumigation record available with last date of it done" },
  { id: 30, db: "RandomSamplesTaken", label: "Number of random samples taken and observed" },
  { id: 31, db: "InfestationObservedInStock", label: "Whether any infestation/deterioration observed in stock" },
  { id: 32, db: "NameOfStorageInCharge", label: "Name of Warehouse/Cold storage incharge" },
  { id: 33, db: "InChargeWearingId", label: "Is warehouse incharge wearing proper ID?" },
  { id: 34, db: "CMServiceStaffVisit", label: "Does CM services staff visit location daily/weekly/monthly" },
  { id: 35, db: "LastInspectionDone", label: "Last inspection done (by concerned CM staff) with details of date, name & designation of employee" },
]

export default function InspectionFormPage() {
  const [form, setForm] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   // Add other required fields here (inspector_id, etc.)
  //   const payload = {
  //     ...form,
  //     inspector_id: 2, // example, replace with actual value
  //     Status: "Pending"
  //   }
  //   await fetch("http://localhost:8000/inspections", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload)
  //   })
  //   alert("✅ Inspection form submitted!")
  // }
  // After successful login, store inspector_id
// localStorage.setItem("inspector_id", response.id); // Do this in your login logic

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const inspector_id = localStorage.getItem("id"); // Get from localStorage
  const payload = {
    ...form,
    inspector_id: inspector_id, // Use dynamic value
    Status: "Pending"
  };
  await fetch("http://localhost:8000/inspections", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  alert("✅ Inspection form submitted!");
};

  return (
    <form onSubmit={handleSubmit}>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Parameter</th>
            <th>Yes/No/NA</th>
          </tr>
        </thead>
        <tbody>
          {checklistFields.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.label}</td>
              <td>
                <select
                  value={form[row.db] || ""}
                  onChange={e => handleChange(row.db, e.target.value)}
                  required
                >
                  <option value="">Select</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="NA">NA</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="submit">Submit</button>
    </form>
  )
}
