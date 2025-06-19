export async function POST(request: Request) {
  const { hl7 } = await request.json();
  // Simulate HL7 parsing (very basic)
  const parsed = hl7 ? { messageType: hl7.split("|")[8] || "ADT", patientId: hl7.split("|")[3] || "0000" } : {};
  // Simulate FHIR conversion
  const fhir = {
    resourceType: "Patient",
    id: parsed.patientId,
    meta: { messageType: parsed.messageType },
  };
  // Simulate agent response
  const agentResult = {
    status: "processed",
    agent: "PriorAuthAgent",
    message: `HL7 message of type ${parsed.messageType} processed for patient ${parsed.patientId}`,
  };
  return Response.json({ hl7, parsed, fhir, agentResult });
}