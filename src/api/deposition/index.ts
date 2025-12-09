import type { AxiosInstance } from "axios";
import type { DepositFormData } from "@/lib/validators/depositSchema";
import { mdrepoClient } from "../client";

interface FileUploadMetadata {
  key: string;
}

const uploadSingleFile = async (
  client: AxiosInstance,
  recordId: string,
  file: File
): Promise<void> => {
  const remoteFileName = file.name;
  const metadataPayload: FileUploadMetadata[] = [{ key: remoteFileName }];
  await client.post(
    `/experiments/${recordId}/draft/files`,
    metadataPayload
  );

  await client.put(
    `/experiments/${recordId}/draft/files/${remoteFileName}/content`,
    file,
    {
      headers: {
        "Content-Type": "application/octet-stream",
      },
    }
  );

  await client.post(
    `/experiments/${recordId}/draft/files/${remoteFileName}/commit`
  );
};

export const depositData = async (
  payload: DepositFormData
): Promise<{ recordId: string; message: string }> => {
  try {
    const systemFiles: File[] = (payload.systemInformation.systemFiles || []) as File[];
    const experimentFiles: File[] = payload.experiments.experiments.flatMap(
      (exp) => (exp.experimentFiles || []) as File[]
    );

    const allFilesToUpload = [...systemFiles, ...experimentFiles];

    const initialPayload = {
      files: { enabled: true },
      metadata: {
        ...payload,
        systemInformation: {
          ...payload.systemInformation,
          systemFiles: systemFiles.map(f => ({ name: f.name, size: f.size })) 
        },
        experiments: {
          experiments: payload.experiments.experiments.map(exp => ({
            ...exp,
            experimentFiles: (exp.experimentFiles as File[]).map(f => ({ name: f.name, size: f.size }))
          }))
        }
      },
      parent: {
        communities: { default: payload.administrative.communities },
      },
    };

    const createResponse = await mdrepoClient.post(
      "/experiments/",
      initialPayload
    );

    const recordId = createResponse.data.id || createResponse.data.record_id;
    if (!recordId) {
      throw new Error("Failed to retrieve Record ID from creation response.");
    }

    await Promise.all(
      allFilesToUpload.map((file) => uploadSingleFile(mdrepoClient, recordId, file))
    );

    return {
      recordId,
      message: "Deposit and file uploads completed successfully."
    };

  } catch (error) {
    console.error("Error during deposit workflow:", error);
    throw error;
  }
};
