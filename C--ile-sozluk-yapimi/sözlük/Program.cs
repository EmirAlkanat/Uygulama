using System.Collections;
using System.Diagnostics.Tracing;
using System.Globalization;

namespace NetFramework.S6.D3.HashTableGenelKullanimi
{
    internal class Program
    {
        static void Main(string[] args)
        {
            Hashtable tr_en = new Hashtable();
            Hashtable en_tr = new Hashtable();
            string selectLanguage = string.Empty;
            string searchTR, searchEn, changeTR, changeEN;
            do
            {
                Console.Write("Hoşgeldiniz türkçe için tr ingilizce için en yazınız çıkış için exit yazınız: ");
                selectLanguage = Console.ReadLine();
                string newValue = string.Empty;
                newValue = newValue.ToLower();
                if (selectLanguage == "tr")
                {

                    Console.WriteLine("Kelime Eklemek İçin    -1-\n" +
                                  "Kelime Aramak İçin     -2-\n" +
                                  "Kelime Düzenlemek için -3-");
                    string secim = Console.ReadLine();


                    if (secim == "1")
                    {
                        do
                        {
                        tr:
                            Console.Write("Lütfen Eklemek istediğiniz türkçe kelimeyi yazınız: ");
                            string tr = Console.ReadLine();

                            tr = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(tr.ToLower());


                            if (tr_en.ContainsKey(tr))
                            {
                                Console.WriteLine(tr + " Türkçe Key Değeri Daha Önceden Eklendi: Lütfen Başka Bir Key Değeri Giriniz: ");
                                goto tr;
                            }
                            else
                            {
                            en:
                                Console.Write($"Lütfen Türkçe '{tr}' kelimesine karşılık gelen ingilizce kelimeyi yazınız: ");
                                string en = Console.ReadLine();
                                en = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(en.ToLower());

                                if (tr_en.ContainsKey(en))
                                {
                                    Console.WriteLine($" Ingilizce '{en}' kelimesi '{tr}' key değerine daha önce eklendi lütfen yeni bir ingilizce kelime giriniz:  ");
                                    goto en;
                                }
                                else
                                {
                                    tr_en.Add(tr, en);
                                    en_tr.Add(en, tr);
                                    Console.WriteLine($"'{tr}' kelimesinin ingilizce karşılığı olarak '{en}' kelimesi eklendi ");
                                }


                            }





                            Console.Write("Yeni bir değer eklemek istiyor musunuz: E/H");
                            newValue = Console.ReadLine();


                        } while (newValue != "h");
                    }
                    else if (secim == "2")
                    {
                        Console.Write("Lütfen İngilizce Karşılığını aramak istediğiniz türkçe kelimeyi giriniz: ");
                        searchTR = Console.ReadLine();
                        searchTR = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(searchTR.ToLower());

                        if (tr_en.ContainsKey(searchTR))
                        {
                            Console.WriteLine(searchTR + " = " + tr_en[searchTR]);
                        }




                    }
                    else if (secim == "3")
                    {
                        
                            Console.WriteLine("Lütfen düzenlemek istediğiniz türkçe kelimeyi yazınız: ");
                            searchTR = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(Console.ReadLine().ToLower());

                            if (tr_en.ContainsKey(searchTR))
                            {
                                Console.Write($" Lütfen {searchTR} türkçe kelimesine karşılık gelen {tr_en[searchTR]} ingilizce kelimesini değiştirmek istediğiniz kelimeyi yazınız:  ");
                                changeEN = basHarfBuyutme(Console.ReadLine());

                                tr_en[searchTR] = changeEN;


                            }
                        

                        






                    }











                }
                else if (selectLanguage == "en")
                {

                }
                else
                {
                    Console.WriteLine("Hatalı bir tuşlama yaptınız: ");
                }

            } while (selectLanguage != "exit");







        }

        public static string basHarfBuyutme(string? word)
        {
            word = CultureInfo.CurrentCulture.TextInfo.ToTitleCase(word.ToLower());
            return word;
        }
    }
}