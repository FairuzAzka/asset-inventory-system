import React, { useEffect, useState } from 'react';
import assetService from '../../services/asset.service';

const AssetHistoryList = ({ assetId }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await assetService.getAssetHistory(assetId);
        setHistory(historyData);
      } catch (error) {
        console.error('Error fetching asset history:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [assetId]);

  if (loading) {
    return <p>Loading asset history...</p>;
  }

  return (
    <div className="mt-4">
      <h2 className="text-lg font-medium text-gray-900">Asset History</h2>
      <ul className="divide-y divide-gray-200">
        {history.length > 0 ? (
          history.map((entry, index) => (
            <li key={index} className="py-2">
              <p className="text-sm text-gray-500">{entry.description}</p>
              <time dateTime={entry.date} className="text-xs text-gray-400">
                {new Date(entry.date).toLocaleDateString()}
              </time>
            </li>
          ))
        ) : (
          <p>No history available for this asset.</p>
        )}
      </ul>
    </div>
  );
};

export default AssetHistoryList;
