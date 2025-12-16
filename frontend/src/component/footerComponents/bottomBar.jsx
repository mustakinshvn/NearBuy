const BottomBar = () => {
  return (
     <div className="border-t border-slate-700 mt-8 pt-8 text-center">
          <p className="text-slate-400">
            &copy; {new Date().getFullYear()} NearBuy. All rights reserved.
          </p>
        </div>
  )
}

export default BottomBar