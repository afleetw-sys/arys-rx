export default function PbmDrugsPage() {
  const drugs = [
    { name: 'Humira', generic: 'adalimumab', manufacturer: 'AbbVie', enrolledPatients: 2 },
    { name: 'Enbrel', generic: 'etanercept', manufacturer: 'Amgen', enrolledPatients: 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">Specialty Drugs</h1>
        <p className="text-neutral-500 text-sm mt-1">Drugs under video adherence monitoring</p>
      </div>

      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Drug name</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Generic</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Manufacturer</th>
              <th className="text-left px-4 py-3 font-medium text-neutral-500">Enrolled patients</th>
            </tr>
          </thead>
          <tbody>
            {drugs.map((d) => (
              <tr key={d.name} className="border-b border-neutral-100 last:border-0">
                <td className="px-4 py-3 font-medium text-neutral-800">{d.name}</td>
                <td className="px-4 py-3 text-neutral-500 italic">{d.generic}</td>
                <td className="px-4 py-3 text-neutral-700">{d.manufacturer}</td>
                <td className="px-4 py-3 text-neutral-700">{d.enrolledPatients}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
