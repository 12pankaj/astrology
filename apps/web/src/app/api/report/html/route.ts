import { NextRequest, NextResponse } from 'next/server';
import { generateFullKundliReport, generateKundliReportHtml } from '@vedic-astro/astrology-engine';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get('name') || 'PANKAJ DADHICH';
  const gender = searchParams.get('gender') || 'Male';
  const dob = searchParams.get('dob') || '2002-02-01';
  const tob = searchParams.get('tob') || '06:55';
  const place = searchParams.get('place') || 'Kheri Seela, Rajasthan, India';
  const lat = parseFloat(searchParams.get('lat') || '26.8956');
  const lng = parseFloat(searchParams.get('lng') || '74.4630');

  const reportData = generateFullKundliReport(name, gender, dob, tob, lat, lng, place);
  const reportHtml = generateKundliReportHtml(reportData);

  return new NextResponse(reportHtml, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const name = body.name || 'PANKAJ DADHICH';
  const gender = body.gender || 'Male';
  const dob = body.dob || '2002-02-01';
  const tob = body.tob || '06:55';
  const place = body.place || 'Kheri Seela, Rajasthan, India';
  const lat = typeof body.latitude === 'number' ? body.latitude : 26.8956;
  const lng = typeof body.longitude === 'number' ? body.longitude : 74.4630;

  const reportData = generateFullKundliReport(name, gender, dob, tob, lat, lng, place);
  const reportHtml = generateKundliReportHtml(reportData);

  return new NextResponse(reportHtml, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}
