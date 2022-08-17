import Head from 'next/head';
import { Card } from '@cryptozoo/ui';

export default function Home() {
  return (
    <>
      <Head>
        <title>CryptoZoo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1 className='text-4xl'>ZOO Home</h1>

      <div className="grid grid-cols-6 gap-4">
        <div className="col-span-full tablet:col-span-2">
          <Card layer={2} className="h-full">
            <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Deleniti animi facere minus iure quo, officiis porro velit aut expedita nostrum illum dicta quos ipsa laudantium quod amet? Deleniti rerum, enim eos unde laboriosam ipsa, distinctio expedita vitae, repudiandae itaque dicta veniam ipsum fuga qui et nemo accusamus vel voluptatem assumenda.</p>
          </Card>
        </div>

        <div className="col-span-full tablet:col-span-4">
          <Card layer={2} className="h-full">
            <div className='flex flex-col gap-4'>
              <p>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sint sunt molestias quasi reprehenderit, deleniti officiis dolore asperiores itaque. Sed, quos nemo. Aperiam, perspiciatis modi? Pariatur iste ratione nemo voluptates quae adipisci cum, officia sapiente. Ratione cupiditate accusantium illum quas nisi quae ipsa? Repellendus odio harum laborum inventore sapiente, vitae, sint, optio exercitationem quis neque ipsa!</p>
              <Card layer={3}>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias nemo soluta sunt rerum harum ut excepturi, odio corporis, fugit ab magnam dolore possimus. Quisquam, quod tenetur a aut mollitia delectus repellendus necessitatibus debitis fugit expedita labore perspiciatis illo ipsa corrupti obcaecati temporibus cumque accusantium quas neque ea laudantium. A modi nobis, illo corporis fugit error aperiam consectetur sint deleniti officiis esse velit saepe unde, illum adipisci. Dolorum earum obcaecati natus! Autem, sunt?</p>
              </Card>
            </div>
          </Card>
        </div>

        <div className="col-span-full">
          <Card layer={2}>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem repellat quam similique optio maxime soluta, quos minima modi molestiae. Fugit explicabo similique atque deserunt, repellendus veniam dolorum ducimus deleniti eius quas ad consequatur, quae facilis quod impedit! Ea ut quasi minima nemo eveniet itaque tempore vel consequatur, dolorum nisi eius perferendis eum numquam. Ut facere omnis et fugit reprehenderit numquam dignissimos necessitatibus quo perspiciatis unde aperiam molestias obcaecati, modi ipsam esse ducimus amet ad quis incidunt officiis! Eius tempore voluptatem, dicta pariatur officiis commodi iure voluptatum. Repellat, laudantium quia. Sunt ut commodi corrupti neque. Maiores delectus maxime pariatur nisi. Ipsam libero aperiam sit ducimus corporis excepturi architecto vero aliquam, praesentium, omnis cumque natus quaerat quibusdam non. Beatae quasi doloremque nulla animi amet, sunt non minus mollitia iusto ipsam facere qui, accusamus asperiores eligendi. Explicabo quam deleniti fuga id. Fuga dicta ab reprehenderit aspernatur iusto facilis totam nobis? Facilis nihil delectus veniam quam id. Obcaecati quam iusto voluptates magni, quos vero sapiente itaque recusandae dolorum dolore doloribus commodi numquam fugiat neque illo. Possimus et ullam earum libero sint asperiores saepe enim molestiae mollitia, laudantium excepturi reiciendis optio error? Amet mollitia et error architecto, quae suscipit? Fugit maiores totam accusantium? Magnam sit temporibus inventore numquam consequuntur odio minus voluptatibus quia! Accusantium reprehenderit cum veniam! Iure vero laborum ratione, numquam ad unde, nobis quo voluptatem veniam officia porro sed, quam fuga qui id eos aliquam perspiciatis. Magni similique natus iusto debitis, possimus omnis, aspernatur obcaecati ad amet ratione dolores aut explicabo necessitatibus iure, consequuntur soluta quos nobis provident.</p>
          </Card>
        </div>

      </div>

      {/* <Test id="1" /> */}
      {/* <Card userId="1" /> */}
    </>
  );
}
