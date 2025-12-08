import React from 'react';
import { NavLink } from 'react-router-dom'

export default function AddTorrentButton({  }) {
  return (
    <div className="flex w-full justify-end pb-10">
      <NavLink to="/add" className="w-full sm:w-auto">
        <button
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all hover:shadow-lg">
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Add Torrent
        </button>
      </NavLink>
    </div>
  );
}
