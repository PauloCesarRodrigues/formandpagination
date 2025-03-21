import type { NextApiRequest, NextApiResponse } from "next";
import productsData from '@/assets/productsData.json';

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;
  const { pageNumber, infiniteScroll } = req.query;
  const productsPerPage = 4;

  if (method !== 'GET') return res.status(405).end();
  if (!pageNumber) return res.status(400).end();

  const page = Number(pageNumber);

  if (page < 1) {
    return res.status(400).json({ error: 'Page number must be 1 or greater.' });
  }

  const isInfiniteScroll = infiniteScroll === 'true';

  const productsQuantity = productsData.products.length;
  const pagesQuantity = Math.ceil(productsQuantity / productsPerPage);

  const firstItemOnPage = (page - 1) * productsPerPage;
  const lastItemOnPage = firstItemOnPage + productsPerPage;

  const products = productsData.products.slice(firstItemOnPage, lastItemOnPage);

  if (isInfiniteScroll) {
    return res.status(200).json(productsData);
  } else {
    return res.status(200).json({
      meta: {
        pagesQuantity,
        productsPerPage
      },
      products
    });
  }
}