import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {method} = req

  const {email, name} = req.body

  if(method !== 'POST') return res.status(405)
  if(!email || !name) return res.status(400)


  return res.status(200).json({data:{email, name}})
}
