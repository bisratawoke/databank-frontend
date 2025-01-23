"use client";
import React from "react";
import Link from "next/link";

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <header className="w-full bg-blue-600 py-4">
        <h1 className="text-center text-3xl font-bold text-white">
          Welcome to the Statistic Portal
        </h1>
      </header>

      <main className="flex flex-col items-center mt-10 space-y-6">
        <p className="text-xl text-gray-700">
          Navigate through the portal to explore departments and reports.
        </p>
        <Link href="/departments">
          <p className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition duration-300">
            Go to Departments
          </p>
        </Link>
      </main>

      <footer className="mt-auto w-full py-4 bg-gray-200 text-center text-gray-600">
        &copy; 2024 ESS
      </footer>
    </div>
  );
};

export default HomePage;
