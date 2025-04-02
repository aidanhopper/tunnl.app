import Content from '@/components/content';
import Navbar from '@/components/navbar';

const Home = () => {
  return (
    <main>
      <div
        className='flex justify-center items-center h-8 bg-accent font-mono text-sm'>
        Alpha release coming soon! 🚀
      </div>
      <Navbar />
      <Content>
        <div className=' w-full h-96 grid grid-cols-2'>
          <div className='flex'>
            asdf
          </div>
          <div className='flex justify-end'>
            213
          </div>
        </div>
      </Content>
    </main>
  )
}

export default Home;