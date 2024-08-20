import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:5000/clusters'); 
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching clusters from backend:', error);
    return NextResponse.error();
  }
}
