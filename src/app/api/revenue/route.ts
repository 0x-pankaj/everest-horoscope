import { NextResponse } from 'next/server';
import { database } from '@/appwrite/serverConfig';
import conf from '@/conf/conf';
import { Query } from 'appwrite';

export async function GET() {
  try {
    const response = await database.listDocuments(
      conf.appwriteHoroscopeDatabaseId,
      conf.appwriteTransactionHistoryCollectionId,
      [
        Query.equal('status', 'completed'),
        Query.orderDesc('$createdAt'),
        Query.limit(100)
      ]
    );

    const transactions = response.documents;

    // Calculate total revenue
    const totalRevenue = transactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    // Calculate daily revenue for the last 7 days
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    });

    const dailyRevenue = last7Days.map(date => {
      const dayTransactions = transactions.filter(t => 
        new Date(t.$createdAt).toISOString().split('T')[0] === date
      );
      const revenue = dayTransactions.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      return { date, revenue };
    }).reverse();

    // Calculate monthly revenue
    const monthlyRevenue = transactions.reduce((acc, t) => {
      const month = new Date(t.$createdAt).toISOString().slice(0, 7);
      acc[month] = (acc[month] || 0) + (Number(t.amount) || 0);
      return acc;
    }, {} as Record<string, number>);

    // Get recent transactions
    const recentTransactions = transactions.slice(0, 5);

    return NextResponse.json({
      totalRevenue,
      dailyRevenue,
      monthlyRevenue: Object.entries(monthlyRevenue).map(([month, revenue]) => ({
        month,
        revenue
      })),
      recentTransactions
    });
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return NextResponse.json({ error: 'Failed to fetch revenue data' }, { status: 500 });
  }
}