function NotFound() {
  return (
    <div className="page notFound flex flex-col items-center justify-center gap-5 h-screen">
      <h1 className="text-8xl ">OOPS!</h1> <h1 className="text-4xl">Page Not found</h1>
      <p className="text-secondary p-2 pl-8 text-xl">Check your URL and try again</p>
    </div>
  )
}

export default NotFound
