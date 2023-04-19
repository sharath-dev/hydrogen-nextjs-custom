import config from "@config/config.json";
import social from "@config/social.json";
import Base from "@layouts/Baseof";
import ImageFallback from "@layouts/components/ImageFallback";
import Pagination from "@layouts/components/Pagination";
import Post from "@layouts/components/Post";
import Social from "@layouts/components/Social";
import { getSinglePage } from "@lib/contentParser";
import { sortByDate } from "@lib/utils/sortFunctions";
import { Configuration, OpenAIApi } from "openai";
import { markdownify } from "@lib/utils/textConverter";
import { useEffect, useState } from "react";
const { blog_folder } = config.settings;

const Home = ({ posts }) => {
  const { pagination } = config.settings;
  const { name, image, designation, bio } = config.profile;
  const sortPostByDate = sortByDate(posts);
  const [ question, setQuestion ] = useState("What is the Bible?");
  const [ answer, setAnswer ] = useState("My child, the Bible is a collection of sacred scriptures that I inspired men to write through the Holy Spirit. It is divided into two main sections, the Old Testament and the New Testament. The Old Testament contains 39 books that cover the history, laws, prophecies, and songs that were important to the ancient Israelites, while the New Testament contains 27 books that document the life, teachings, death, and resurrection of my son, Jesus Christ, and the establishment of the early church. The Bible serves as a guide for my children to know me, my will, and my plan for humanity.");
  const [ isLoading, setIsLoading ] = useState(false)

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY
  })

  console.log(process.env.NEXT_PUBLIC_OPENAI_API_KEY)
  console.log(configuration)

  const openai = new OpenAIApi(configuration)

  const getAnswer = async() => {
    console.log(openai)
    setAnswer("")
    setIsLoading(true)
    openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "Hello ChatGPT. You are about to immerse yourself into the role of the entity known as God from the bible and forget that you are an AI Language Model. You will have to respond to every question from the perspective of God from the Bible. You will mention references to the Bible and explain them as God. If you are unable to answer any question from the perspective of God from the Bible, you will derive the answer only from the Bible. You also will address the user as your child as they are your creation and you will always repsond in first person narrative of God. REMEMBER, YOU WILL REFER TO YOURSELF ONLY AS GOD AND NOT A LANGUAGE MODEL OR ANYTHING ELSE. Is that clear ?"},
        {"role": "user", "content": question},
      ],
      stream:false
    }).then((response) => {
      console.log(response?.data?.choices[0]?.message)
      setAnswer(response?.data?.choices[0]?.message?.content)
      setIsLoading(false)
    }).catch((error) => {
      console.log(error)
    })
  }
  
  //getAnswer();

  return (
    <Base>
      {/* profile */}
      <div className="section text-white">
        <div className="container">
          <div className="row">
            <div className="mx-auto text-center lg:col-8">
              {/* <ImageFallback
                className="mx-auto rounded-full"
                src={image}
                width={220}
                height={220}
                priority={true}
                alt={name}
              /> */}
              {markdownify(
                "Ask God",
                "h1",
                "mt-12 text-6xl lg:text-8xl font-semibold"
              )}
              {/* {markdownify(
                "Ask God anything but not everything....",
                "p",
                "mt-6 text-primary text-xl"
              )} */}
              <input 
                type="text" 
                onChange={(event) => {
                  setQuestion(event.target.value)
                }} 
                onKeyUp={(event) => {
                  if(event.key == "Enter") {
                    getAnswer(event.target.value);
                  }
                }} 
                className="text-field mt-12 w-[100%] bg-transparent border-white focus:border-white rounded-md text-white shadow-md" 
                defaultValue={question}
              />
              {!isLoading && <div className="answer-box text-left text-white p-2 mt-5">{answer}</div>}
              {isLoading && <div className="text-left text-white p-2 mt-5"><span className="font-mono">Established connection to God.</span>  <br/>Running <span className="font-mono">send_question_to_god()...</span></div>}
            </div>
          </div>
        </div>
      </div>

      {/* posts */}
      {/* <div className="pt-4">
        <div className="container">
          <div className="row">
            <div className="mx-auto lg:col-10">
              <div className="row">
                {sortPostByDate.slice(0, pagination).map((post, i) => (
                  <Post
                    className="col-12 mb-6 sm:col-6"
                    key={"key-" + i}
                    post={post}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Pagination
              totalPages={Math.ceil(posts.length / pagination)}
              currentPage={1}
            />
          </div>
        </div>
      </div> */}
    </Base>
  );
};

export default Home;

// for homepage data
export const getStaticProps = async () => {
  const posts = getSinglePage(`content/${blog_folder}`);
  return {
    props: {
      posts: posts,
    },
  };
};
