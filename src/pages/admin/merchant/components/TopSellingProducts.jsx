import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TopSellingProducts = () => {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-5 pt-5 sm:px-2 sm:pt-6 lg:px-6 shadow-md">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-800 ">
          Top Selling Products
        </h3>
        <div className="relative inline-block">
          {" "}
          <Select>
            <SelectTrigger className="">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="lastWeek">Last Week</SelectItem>
                <SelectItem value="lastMonth">Last Month</SelectItem>
                <SelectItem value="lastYear">Last Year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto custom-scrollbar border-t border-gray-200">
        <div className=" max-h-[390px]">
          <div className="mt-4 space-y-2">
            <div className=" flex justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <div>
                  <p className="text-ms text-gray-800">
                    Ladies Stylish Hand bag
                  </p>
                  <p className="text-xs text-gray-400">
                    Increased by <span className="text-green-500">1.75%</span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">$3,100</p>
              </div>
            </div>
            <div className=" flex justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <div>
                  <p className="text-sm text-gray-800">Altra Pro Max Camera</p>
                  <p className="text-xs text-gray-400">
                    Decreased by <span className="text-red-500">1.75%</span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">5,980</p>
              </div>
            </div>
            <div className=" flex justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <div>
                  <p className="text-sm text-gray-800">Lightweight Sofa</p>
                  <p className="text-xs text-gray-400">
                    Increased by <span className="text-green-500">1.75%</span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">1,850</p>
              </div>
            </div>
            <div className=" flex justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-teal-500"></div>
                <div>
                  <p className="text-sm text-gray-800">Lightweight Sneakers</p>
                  <p className="text-xs text-gray-400">
                    Increased by <span className="text-green-500">1.75%</span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">2,670</p>
              </div>
            </div>
            <div className=" flex justify-between">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="">
                  <p className="text-sm text-gray-800">Samsung Headset</p>
                  <p className="text-xs text-gray-400">
                    Decreased by <span className="text-red-500">1.75%</span>
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-800">3,124</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopSellingProducts;
