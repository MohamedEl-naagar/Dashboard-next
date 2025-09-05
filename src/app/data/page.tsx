export default async function Home() {
  const apiKey =
    "patKFVFgoOker2N6a.1bcdfa9c1c760b378d785a721662f2b1be4be43677336209a76c6f4696f8fcf2";
  const baseId = "appKrDCCamzI89g7i";
  const tableName = "Clients";
  const campaignName = "Adam Ecker";

  const formula = `TRIM({Campaign's Name (Trimmed)})="${campaignName}"`;
  const encodedFormula = encodeURIComponent(formula);

  const url = `https://api.airtable.com/v0/${baseId}/${tableName}?filterByFormula=${encodedFormula}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  const data = await response.json();

  if (!data.records || data.records.length === 0) {
    return <div className="p-6 text-red-500">No records found.</div>;
  }

  const record = data.records[0];
  const fields = record.fields;

  // Trim status and decide color
  const status = fields["Account Status"]?.trim() || "Unknown";
  const statusColor =
    status === "Cancelled" ? "text-red-600" : "text-green-600";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-gray-100">
          <h1 className="text-2xl font-bold text-gray-800">
            {fields["Campaign's Name (Trimmed)"]}
          </h1>
          <span
            className={`px-3 py-1 text-sm font-medium ${statusColor} bg-gray-200 rounded-full`}
          >
            {status}
          </span>
        </div>

        {/* Logo */}
        {fields["Logo"]?.[0]?.url && (
          <div className="flex justify-center py-6">
            <img
              src={fields["Logo"][0].url}
              alt="Client Logo"
              className="w-40 h-auto rounded-lg shadow"
            />
          </div>
        )}

        {/* Details */}
        <div className="px-6 py-4 grid grid-cols-2 gap-6 text-gray-700">
          <div>
            <p className="font-semibold">Client Name</p>
            <p className="text-black">{fields["Name"]}</p>
          </div>
          <div>
            <p className="font-semibold">Industry</p>
            <p className="text-black">{fields["Industry"].trim()}</p>
          </div>
          <div>
            <p className="font-semibold">Contract Length</p>
            <p className="text-black">{fields["Contract Length"]} month(s)</p>
          </div>
          <div>
            <p className="font-semibold">Seats</p>
            <p className="text-black">{fields["Number of seats"]}</p>
          </div>
          <div>
            <p className="font-semibold">Start Date</p>
            <p className="text-black">{fields["Start date [Dialing]"]}</p>
          </div>
          <div>
            <p className="font-semibold">End Date</p>
            <p className="text-black">{fields["End Date"]}</p>
          </div>
        </div>

        {/* CSM Info */}
        <div className="px-6 py-4 border-t bg-gray-50">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Client Success Manager
          </h2>
          <p className="text-black">
            <span className="font-semibold">Name:</span> {fields["CSM's Name"]}
          </p>
          <p className="text-black">
            <span className="font-semibold">Email:</span>{" "}
            {fields["Email (from CSMs Bio)"]}
          </p>
        </div>
      </div>
    </div>
  );
}
