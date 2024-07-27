import { Request, Response } from 'express';
import fs from 'fs';
import { container } from 'tsyringe';

import GenerateExcelReportService from '@modules/sales/infra/http/services/GenerateExcelReportService';

import GeneratePdfReportService from '../services/GeneratePdfReportService';

export default class SalesReportController {
  async pdfFile(request: Request, response: Response) {
    const { company, initialDate, finalDate, status } = request.query;

    const generatePdfReportService = container.resolve(
      GeneratePdfReportService,
    );

    const pdfReportInfo = await generatePdfReportService.execute({
      initialDate: initialDate ? new Date(initialDate as string) : undefined,
      finalDate: finalDate ? new Date(finalDate as string) : undefined,
      company: (company as string) || undefined,
      status: (status as string) || undefined,
    });

    return response.json(pdfReportInfo);
  }

  async excelFile(request: Request, response: Response) {
    const { startRangeFinishedDate, endRangeFinishedDate, company, status } =
      request.query;

    const user_id = request.user.id;

    const generateExcelReportService = container.resolve(
      GenerateExcelReportService,
    );

    const excel = await generateExcelReportService.execute({
      startRangeFinishedDate: startRangeFinishedDate
        ? new Date(startRangeFinishedDate as string)
        : undefined,
      endRangeFinishedDate: endRangeFinishedDate
        ? new Date(endRangeFinishedDate as string)
        : undefined,
      company: (company as string) || undefined,
      status: (status as string) || undefined,
      user_id,
    });

    return response.json(excel);
  }

  async download(request: Request, response: Response) {
    const { fileName } = request.params;

    console.log("🚀 ~ SalesReportController ~ download ~ `${__dirname}/tmp/uploads/${fileName}`:", `${__dirname}/tmp/uploads/${fileName}`)
    try {
      if (!fs.existsSync(`${__dirname}/tmp/uploads/${fileName}`)) {
        return response.status(400).json('File is no longer available.');
      }

      return response.download(`${__dirname}/tmp/uploads/${fileName}`);
    } catch (error: any) {
      return response.status(400).json(error?.message || 'erro');
    }
  }
}
