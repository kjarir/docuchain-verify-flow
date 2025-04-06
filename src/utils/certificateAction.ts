// function to create and verify certificates
import { getContract } from "./contractUtils";

export async function createCertificate(documentId: string) {
  const contract = await getContract();
  const tx = await contract.createCertificate(documentId);
  await tx.wait();
  return true;
}

export async function getCertificate(documentId: string) {
  const contract = await getContract();
  const cert = await contract.certificates(documentId);
  return cert;
}

export async function verifyCertificate(documentId: string) {
  const contract = await getContract();
  const cert = await contract.certificates(documentId);
  return cert;
}
