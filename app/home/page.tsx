import React from "react";

function DataPortalPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <section className="text-center py-12 bg-gray-50">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Ess Data Portal Open Data
          </h1>
          <p className="text-gray-700 max-w-2xl mx-auto px-4">
            Access and explore open data gathered through the ESS Data Portal.
            Discover insights and more information on Ethiopia’s socio-economic
            indicators.
          </p>
        </section>

        <section className="container mx-auto py-8 px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Most Recent Reports
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>
                  Data on Ethiopia: grain production, livestock population, and
                  more
                </li>
                <li>
                  Data on Ethiopia’s industrial output, manufacturing, and more
                </li>
                <li>
                  Data on Ethiopia’s population distribution, electricity
                  access, and more
                </li>
              </ul>
              <a href="#" className="text-blue-600 hover:underline font-medium">
                View All
              </a>
            </div>

            <div className="bg-white rounded shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Most Recent Reports
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                <li>
                  Data on Ethiopia: grain production, livestock population, and
                  more
                </li>
                <li>
                  Data on Ethiopia’s industrial output, manufacturing, and more
                </li>
                <li>
                  Data on Ethiopia’s population distribution, electricity
                  access, and more
                </li>
              </ul>
              <a href="#" className="text-blue-600 hover:underline font-medium">
                View All
              </a>
            </div>
          </div>
        </section>

        <section className="container mx-auto py-8 px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
            More Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="bg-white rounded shadow p-6 text-center"
              >
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Stat Bank
                </h3>
                <p className="text-gray-700">
                  Short description or link to the resource.
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* <footer className="bg-white py-6 mt-auto">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <img
                src="/path-to-your-footer-logo.png"
                alt="Footer Logo"
                className="h-8 mx-auto md:mx-0 mb-2"
              />
              <p className="text-sm text-gray-500">
                © 2023 Ethiopian Statistics Service
              </p>
            </div>
            <div className="space-x-4 text-center md:text-right">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                About
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Resources
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer> */}
    </div>
  );
}

export default DataPortalPage;
