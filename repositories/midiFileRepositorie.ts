import { ServerResponse, Status } from "@/types/server-response";
import { Repository } from "./repository";
import { Midifile, MMAGrooveTitle } from "@/lib/generated/prisma/client";

export default class MidiFileRepository extends Repository {
  async create(url: string, configId: number): Promise<ServerResponse<undefined>> {
    await this.client.midifile.upsert({
      where: {
        configId: configId,
      },
      update: {
        url: url,
      },
      create: {
        configId: configId,
        url: url,
      },
    });

    return {
      status: Status.Ok,
      success: true,
      data: undefined,
    };
  }

  async getFromConfig(groove: MMAGrooveTitle, configId: number): Promise<ServerResponse<Midifile>> {
    const file = await this.client.midifile.findFirst({
      where: {
        configId: configId,
        config: {
          id: configId,
          groove: groove,
        },
      },
    });

    return file
      ? {
          data: file,
          success: true,
          status: Status.Ok,
        }
      : {
          success: false,
          status: Status.NotFound,
          title: "The specified groove does not exist yet",
        };
  }
}
