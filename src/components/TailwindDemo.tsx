import React from 'react';

const TailwindDemo: React.FC = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-indigo-600">Tailwind CSS 示例</h1>
      
      {/* 颜色系统 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">颜色系统</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-500 text-white p-4 rounded shadow">蓝色 (blue-500)</div>
          <div className="bg-green-500 text-white p-4 rounded shadow">绿色 (green-500)</div>
          <div className="bg-red-500 text-white p-4 rounded shadow">红色 (red-500)</div>
          <div className="bg-yellow-500 text-white p-4 rounded shadow">黄色 (yellow-500)</div>
          <div className="bg-purple-500 text-white p-4 rounded shadow">紫色 (purple-500)</div>
          <div className="bg-pink-500 text-white p-4 rounded shadow">粉色 (pink-500)</div>
          <div className="bg-gray-500 text-white p-4 rounded shadow">灰色 (gray-500)</div>
          <div className="bg-indigo-500 text-white p-4 rounded shadow">靛蓝 (indigo-500)</div>
        </div>
      </section>
      
      {/* 间距和尺寸 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">间距和尺寸</h2>
        <div className="space-y-4">
          <div className="p-2 bg-gray-100 border border-gray-300 rounded">内边距 p-2</div>
          <div className="p-4 bg-gray-100 border border-gray-300 rounded">内边距 p-4</div>
          <div className="p-8 bg-gray-100 border border-gray-300 rounded">内边距 p-8</div>
          <div className="mt-8 bg-gray-100 border border-gray-300 rounded p-2">外边距顶部 mt-8</div>
        </div>
      </section>
      
      {/* 弹性布局 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">弹性布局</h2>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="bg-indigo-200 p-4 rounded">项目 1</div>
          <div className="bg-indigo-300 p-4 rounded">项目 2</div>
          <div className="bg-indigo-400 p-4 rounded">项目 3</div>
        </div>
        <div className="flex justify-between mb-4">
          <div className="bg-green-200 p-4 rounded">左侧</div>
          <div className="bg-green-300 p-4 rounded">中间</div>
          <div className="bg-green-400 p-4 rounded">右侧</div>
        </div>
        <div className="flex flex-col items-center space-y-2">
          <div className="bg-purple-200 p-4 rounded w-1/2">垂直项目 1</div>
          <div className="bg-purple-300 p-4 rounded w-1/2">垂直项目 2</div>
          <div className="bg-purple-400 p-4 rounded w-1/2">垂直项目 3</div>
        </div>
      </section>
      
      {/* 响应式设计 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">响应式设计</h2>
        <div className="bg-yellow-100 p-4 rounded text-center">
          <p className="text-sm md:text-base lg:text-lg xl:text-xl">
            这段文字会根据屏幕大小改变字体大小
          </p>
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="bg-blue-100 p-4 rounded shadow">响应式网格 1</div>
          <div className="bg-blue-200 p-4 rounded shadow">响应式网格 2</div>
          <div className="bg-blue-300 p-4 rounded shadow">响应式网格 3</div>
          <div className="bg-blue-400 p-4 rounded shadow">响应式网格 4</div>
        </div>
      </section>
      
      {/* 交互状态 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">交互状态</h2>
        <div className="space-y-4">
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            悬停效果
          </button>
          <div className="mt-4">
            <input 
              type="text" 
              placeholder="获取焦点时的边框变化" 
              className="border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded p-2 w-full"
            />
          </div>
          <div className="mt-4">
            <button className="bg-green-500 active:bg-green-700 text-white font-bold py-2 px-4 rounded transition duration-300">
              点击效果
            </button>
          </div>
        </div>
      </section>
      
      {/* 自定义样式 */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">自定义样式</h2>
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-6 rounded-lg shadow-lg">
          <p className="font-bold">渐变背景</p>
        </div>
        <div className="mt-4 bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
          <p>左侧边框强调</p>
        </div>
        <div className="mt-4 bg-white p-6 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300">
          <p>悬停时阴影变化</p>
        </div>
      </section>
    </div>
  );
};

export default TailwindDemo;