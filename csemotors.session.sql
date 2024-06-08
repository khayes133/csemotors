SELECT *
FROM public.inventory AS i
    JOIN public.classification AS c ON i.classification_id = c.classification_id
WHERE i.classification_id = 5