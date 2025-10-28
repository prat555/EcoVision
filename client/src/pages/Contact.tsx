import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPinIcon, MailIcon, PhoneIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(5, {
    message: "Subject must be at least 5 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    // In a real app, this would send the form data to a server
    setTimeout(() => {
      setIsSubmitting(false);
      form.reset();
      
      toast({
        title: "Message sent successfully",
        description: "Thank you for contacting us. We'll get back to you soon.",
        duration: 5000,
      });
    }, 1500);
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4 text-center">Contact Us</h1>
        <p className="text-lg text-center mb-10">Have questions about waste management or EcoVision? We're here to help!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 shrink-0">
                <MapPinIcon className="h-7 w-7 text-primary shrink-0" strokeWidth={2} />
              </div>
              <CardTitle className="text-lg mb-2">Our Location</CardTitle>
              <CardDescription>123 Green Street<br />Eco City, EC 12345<br />United States</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 shrink-0">
                <MailIcon className="h-7 w-7 text-primary shrink-0" strokeWidth={2} />
              </div>
              <CardTitle className="text-lg mb-2">Email Us</CardTitle>
              <CardDescription>info@ecovision.com<br />support@ecovision.com</CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4 shrink-0">
                <PhoneIcon className="h-7 w-7 text-primary shrink-0" strokeWidth={2} />
              </div>
              <CardTitle className="text-lg mb-2">Call Us</CardTitle>
              <CardDescription>(555) 123-4567<br />Mon-Fri, 9AM-5PM</CardDescription>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-heading text-primary">Send Us a Message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Your email address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Message subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Your message" 
                          className="min-h-[150px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full md:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
