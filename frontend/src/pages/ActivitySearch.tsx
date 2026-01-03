import { useEffect, useMemo, useState } from 'react';
import { Search as SearchIcon, Filter, ChevronDown, Star, Clock, MapPin, DollarSign } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import { getActivities, getCities, type ActivitySort } from '../api/axiosInstance';

type City = {
  id: number;
  name: string;
  country: string;
};

type Activity = {
  id: number;
  name: string;
  category: string;
  description: string;
  cost: string | number;
  duration: number;
  rating: number;
  image_url?: string | null;
  city?: City | null;
};

function formatDuration(minutes: number) {
  if (!Number.isFinite(minutes) || minutes <= 0) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours <= 0) return `${mins} min`;
  if (mins === 0) return `${hours} hr`;
  return `${hours} hr ${mins} min`;
}

function parseCost(cost: string | number) {
  if (typeof cost === 'number') return cost;
  const num = Number(String(cost).replace(/[^0-9.]/g, ''));
  return Number.isFinite(num) ? num : 0;
}

export default function ActivitySearch() {
  const [query, setQuery] = useState('');
  const [groupBy, setGroupBy] = useState<'none' | 'destination'>('none');
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCityId, setSelectedCityId] = useState<number | ''>('');

  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  const [minCost, setMinCost] = useState<number | ''>('');
  const [maxCost, setMaxCost] = useState<number | ''>('');
  const [minRating, setMinRating] = useState<number | ''>('');
  const [sort, setSort] = useState<ActivitySort>('rating');

  const [loading, setLoading] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const res = await getCities();
        setCities(res.data ?? []);
      } catch (e) {
        setCities([]);
      }
    };
    loadCities();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        const res = await getActivities({
          q: query || undefined,
          city_id: selectedCityId === '' ? undefined : selectedCityId,
          min_cost: minCost === '' ? undefined : Number(minCost),
          max_cost: maxCost === '' ? undefined : Number(maxCost),
          min_rating: minRating === '' ? undefined : Number(minRating),
          sort,
        });
        setActivities(res.data ?? []);
      } finally {
        setLoading(false);
      }
    };

    const t = setTimeout(load, 250);
    return () => {
      controller.abort();
      clearTimeout(t);
    };
  }, [query, selectedCityId, minCost, maxCost, minRating, sort]);

  const grouped = useMemo(() => {
    if (groupBy !== 'destination') return null;
    const by = new Map<string, Activity[]>();
    for (const a of activities) {
      const key = a.city ? `${a.city.name}, ${a.city.country}` : 'Other';
      by.set(key, [...(by.get(key) ?? []), a]);
    }
    return Array.from(by.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [activities, groupBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Activity Search</h1>

          <div className="flex flex-col gap-3">
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[260px] relative">
                <input
                  type="text"
                  placeholder="Search activities or cities (e.g., Paragliding)"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <SearchIcon className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="flex gap-3">
                <div className="relative">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => {
                      setSortOpen(false);
                      setFilterOpen(false);
                    }}
                  >
                    Group by
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setSortOpen(false);
                    setFilterOpen((v) => !v);
                  }}
                >
                  <Filter className="h-4 w-4" />
                  Filter
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setFilterOpen(false);
                    setSortOpen((v) => !v);
                  }}
                >
                  Sort by...
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <div className="min-w-[220px]">
                <select
                  value={groupBy}
                  onChange={(e) => setGroupBy(e.target.value as any)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="none">No grouping</option>
                  <option value="destination">Destination</option>
                </select>
              </div>

              <div className="min-w-[260px]">
                <select
                  value={selectedCityId}
                  onChange={(e) => setSelectedCityId(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Cities</option>
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}, {c.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filterOpen && (
              <Card className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Min Price"
                    type="number"
                    placeholder="0"
                    value={minCost}
                    onChange={(e) => setMinCost(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                  <Input
                    label="Max Price"
                    type="number"
                    placeholder="200"
                    value={maxCost}
                    onChange={(e) => setMaxCost(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                  <Input
                    label="Min Rating"
                    type="number"
                    placeholder="0"
                    value={minRating}
                    onChange={(e) => setMinRating(e.target.value === '' ? '' : Number(e.target.value))}
                  />
                </div>
              </Card>
            )}

            {sortOpen && (
              <Card className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sort</label>
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as ActivitySort)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="rating">Top rated</option>
                      <option value="price-low">Price (low to high)</option>
                      <option value="price-high">Price (high to low)</option>
                      <option value="duration">Duration</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>

        <div className="mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Results</h2>
        </div>

        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-600">Searching activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-600">No activities found. Try another search.</p>
          </div>
        ) : groupBy === 'destination' && grouped ? (
          <div className="space-y-6">
            {grouped.map(([destination, items]) => (
              <div key={destination}>
                <div className="text-sm font-semibold text-gray-700 mb-2">{destination}</div>
                <div className="space-y-3">
                  {items.map((activity) => (
                    <Card key={activity.id} className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {activity.image_url ? (
                            <img src={activity.image_url} alt={activity.name} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">{activity.name}</div>
                          <div className="text-sm text-gray-600">{activity.description}</div>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {activity.city ? `${activity.city.name}, ${activity.city.country}` : '—'}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {formatDuration(activity.duration)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${parseCost(activity.cost).toFixed(0)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              {activity.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <Card key={activity.id} className="p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {activity.image_url ? (
                      <img src={activity.image_url} alt={activity.name} className="w-full h-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{activity.name}</div>
                    <div className="text-sm text-gray-600">{activity.description}</div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {activity.city ? `${activity.city.name}, ${activity.city.country}` : '—'}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {formatDuration(activity.duration)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${parseCost(activity.cost).toFixed(0)}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        {activity.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
