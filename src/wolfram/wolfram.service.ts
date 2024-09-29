import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { env } from 'process';

@Injectable()
export class WolframService {
  constructor(private readonly httpService: HttpService) {}
  async solveMathProblem(problem: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `http://api.wolframalpha.com/v2/query?appid=${env.WOLFRAM_APP_ID}&input=${problem}&podstate=Step-by-step%20solution&output=json`,
      );

      if (response.data.queryresult.error || !response.data.queryresult.success)
        throw new Error('No solution found');

      const pods = response.data.queryresult.pods;
      const result = Array.from(pods).map((pod: any) => {
        // Dont like using this but the wolfram lib doesnt have types
        return {
          title: pod.title || 'No title',
          text: pod.plainText || 'No text',
        };
      });

      //TODO: decide wether save this to db or pass it o a llm first

      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  async attemptSolveQuestion(question: string) {
    try {
      const response = await this.httpService.axiosRef.get(
        `http://api.wolframalpha.com/v2/query?appid=${env.WOLFRAM_APP_ID}&input=${question}&output=json`,
      );

      if (response.data.queryresult.error || !response.data.queryresult.success)
        throw new Error('No solution found');

      const pods = response.data.queryresult.pods;
      const result = Array.from(pods).map((pod: any) => {
        return {
          title: pod.title || 'No title',
          text: pod.plainText || 'No text',
        };
      });

      return result;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
